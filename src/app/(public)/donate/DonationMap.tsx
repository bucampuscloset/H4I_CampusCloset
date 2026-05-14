'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by webpack asset hashing
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface DonationBin {
  id: string
  name: string
  building: string
  latitude: number
  longitude: number
  active: boolean
}

// BU campus center
const BU_CENTER: [number, number] = [42.3505, -71.1054]

export default function DonationMap() {
  const [bins, setBins] = useState<DonationBin[]>([])

  useEffect(() => {
    fetch('/api/donations/bins')
      .then((res) => res.json())
      .then((json: { data: DonationBin[] }) => {
        setBins(json.data ?? [])
      })
      .catch(() => {
        // Silently fail — map still renders, just without pins
      })
  }, [])

  return (
    <MapContainer
      center={BU_CENTER}
      zoom={15}
      className="h-full w-full"
      scrollWheelZoom={false}
      aria-label="Donation bin locations map"
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png${process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY ? `?api_key=${process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY}` : ''}`}
      />
      {bins
        .filter((bin) => bin.active)
        .map((bin) => (
          <Marker key={bin.id} position={[bin.latitude, bin.longitude]}>
            <Popup>
              <span className="font-body font-extrabold">{bin.name}</span>
              <br />
              {bin.building}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
