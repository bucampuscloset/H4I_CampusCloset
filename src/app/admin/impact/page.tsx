'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { getResponseError } from '@/lib/safe-json'

interface ImpactRecord {
  id: string
  eventId: string | null
  itemsReused: number
  itemsDonated: number
  attendance: number
  wasteDivertedKg: number
  waterSavedL: number
  carbonSavedKg: number
  createdAt: string
  Event?: { id: string; title: string } | null
}

interface EventOption {
  id: string
  title: string
}

type Form = {
  eventId: string
  itemsReused: string
  itemsDonated: string
  attendance: string
  wasteDivertedKg: string
  waterSavedL: string
  carbonSavedKg: string
}

const EMPTY: Form = { eventId: '', itemsReused: '', itemsDonated: '', attendance: '', wasteDivertedKg: '', waterSavedL: '', carbonSavedKg: '' }

export default function AdminImpactPage() {
  const [records, setRecords] = useState<ImpactRecord[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState<ImpactRecord | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [impactRes, eventsRes] = await Promise.all([
        fetch('/api/impact?mode=list'),
        fetch('/api/events'),
      ])
      if (!impactRes.ok) throw new Error(`Failed to load impact: ${impactRes.status}`)
      if (!eventsRes.ok) throw new Error(`Failed to load events: ${eventsRes.status}`)
      const [impactJson, eventsJson] = await Promise.all([impactRes.json(), eventsRes.json()])
      setRecords(impactJson.data ?? [])
      setEvents(eventsJson.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load impact stats. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body: Record<string, unknown> = {
        itemsReused: parseInt(form.itemsReused, 10) || 0,
        itemsDonated: parseInt(form.itemsDonated, 10) || 0,
        attendance: parseInt(form.attendance, 10) || 0,
        wasteDivertedKg: parseFloat(form.wasteDivertedKg) || 0,
        waterSavedL: parseFloat(form.waterSavedL) || 0,
        carbonSavedKg: parseFloat(form.carbonSavedKg) || 0,
      }
      if (form.eventId) body.eventId = form.eventId
      const res = await fetch('/api/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create impact record. Please check the form and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(record: ImpactRecord, patch: Partial<ImpactRecord>) {
    setError(null)
    try {
      const res = await fetch(`/api/impact/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update impact record. Please try again.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this impact record?')) return
    setError(null)
    try {
      const res = await fetch(`/api/impact/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete impact record. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-[28px] text-brand-brown">Impact Data</h1>
      <p className="mt-2 font-body text-[14px] text-brand-text/60">
        Log environmental impact stats per event.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">Add Impact Entry</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="impact-event" className="font-body text-[14px] text-brand-text">Link to Event (optional)</label>
            <select
              id="impact-event"
              value={form.eventId}
              onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive"
            >
              <option value="">— Global (no event) —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Items Reused" type="number" value={form.itemsReused} onChange={(e) => setForm({ ...form, itemsReused: e.target.value })} placeholder="0" />
            <Input label="Items Donated" type="number" value={form.itemsDonated} onChange={(e) => setForm({ ...form, itemsDonated: e.target.value })} placeholder="0" />
            <Input label="Attendance" type="number" value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })} placeholder="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Waste Diverted (kg)" type="number" step="0.01" value={form.wasteDivertedKg} onChange={(e) => setForm({ ...form, wasteDivertedKg: e.target.value })} placeholder="0" />
            <Input label="Water Saved (L)" type="number" step="0.01" value={form.waterSavedL} onChange={(e) => setForm({ ...form, waterSavedL: e.target.value })} placeholder="0" />
            <Input label="Carbon Saved (kg)" type="number" step="0.01" value={form.carbonSavedKg} onChange={(e) => setForm({ ...form, carbonSavedKg: e.target.value })} placeholder="0" />
          </div>
          {error && <p className="font-body text-[13px] text-brand-terra">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </Card>

      <h2 className="mb-4 mt-10 font-heading text-[16px] font-bold text-brand-text">
        Records ({records.length})
      </h2>
      {loading ? (
        <p className="font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : records.length === 0 ? (
        <p className="font-body text-[14px] text-brand-text/60">No impact records yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {records.map((rec) => (
            <li key={rec.id}>
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-heading text-[14px] font-bold text-brand-text">
                      {rec.Event?.title ?? 'Global (unlinked)'}
                    </p>
                    <div className="mt-1 grid grid-cols-3 gap-x-6 gap-y-1 font-body text-[13px] text-brand-text/70">
                      <span>{rec.itemsReused} reused</span>
                      <span>{rec.itemsDonated} donated</span>
                      <span>{rec.attendance} attended</span>
                      <span>{rec.wasteDivertedKg} kg waste</span>
                      <span>{rec.waterSavedL} L water</span>
                      <span>{rec.carbonSavedKg} kg CO₂</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(rec)}>Edit</Button>
                    <button onClick={() => handleDelete(rec.id)} className="font-body text-[13px] text-brand-terra hover:underline">Delete</button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditImpactModal
          record={editing}
          events={events}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            await handleUpdate(editing, patch)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function EditImpactModal({ record, events, onClose, onSave }: {
  record: ImpactRecord
  events: EventOption[]
  onClose: () => void
  onSave: (patch: Partial<ImpactRecord>) => Promise<void>
}) {
  const [eventId, setEventId] = useState(record.eventId ?? '')
  const [itemsReused, setItemsReused] = useState(String(record.itemsReused))
  const [itemsDonated, setItemsDonated] = useState(String(record.itemsDonated))
  const [attendance, setAttendance] = useState(String(record.attendance))
  const [wasteDivertedKg, setWasteDivertedKg] = useState(String(record.wasteDivertedKg))
  const [waterSavedL, setWaterSavedL] = useState(String(record.waterSavedL))
  const [carbonSavedKg, setCarbonSavedKg] = useState(String(record.carbonSavedKg))
  const [saving, setSaving] = useState(false)

  return (
    <Modal open onClose={onClose} title="Edit Impact Record">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({
              eventId: eventId || null,
              itemsReused: parseInt(itemsReused, 10) || 0,
              itemsDonated: parseInt(itemsDonated, 10) || 0,
              attendance: parseInt(attendance, 10) || 0,
              wasteDivertedKg: parseFloat(wasteDivertedKg) || 0,
              waterSavedL: parseFloat(waterSavedL) || 0,
              carbonSavedKg: parseFloat(carbonSavedKg) || 0,
            })
          } finally {
            setSaving(false)
          }
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-impact-event" className="font-body text-[14px] text-brand-text">Event</label>
          <select id="edit-impact-event" value={eventId} onChange={(e) => setEventId(e.target.value)} className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text">
            <option value="">— Global —</option>
            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Items Reused" type="number" value={itemsReused} onChange={(e) => setItemsReused(e.target.value)} />
          <Input label="Items Donated" type="number" value={itemsDonated} onChange={(e) => setItemsDonated(e.target.value)} />
          <Input label="Attendance" type="number" value={attendance} onChange={(e) => setAttendance(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Waste (kg)" type="number" step="0.01" value={wasteDivertedKg} onChange={(e) => setWasteDivertedKg(e.target.value)} />
          <Input label="Water (L)" type="number" step="0.01" value={waterSavedL} onChange={(e) => setWaterSavedL(e.target.value)} />
          <Input label="Carbon (kg)" type="number" step="0.01" value={carbonSavedKg} onChange={(e) => setCarbonSavedKg(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
