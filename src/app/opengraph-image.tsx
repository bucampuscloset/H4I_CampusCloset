import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Campus Closet — BU Clothing Swap'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F7F4F0 0%, #C1CEBF 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#4D3A29',
              letterSpacing: '-2px',
            }}
          >
            Campus Closet
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#5F6A4F',
              fontWeight: 600,
            }}
          >
            Sustainable Fashion at Boston University
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#222222',
              opacity: 0.7,
              maxWidth: '700px',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Swap, donate, and discover clothing while reducing fast fashion and building a better campus.
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
