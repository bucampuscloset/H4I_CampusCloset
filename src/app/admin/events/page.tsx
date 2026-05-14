'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Event {
  id: string
  title: string
  type: string
  date: string
  location: string
  description: string | null
  itemLimit: number | null
  createdAt: string
}

type Form = {
  title: string
  type: string
  date: string
  location: string
  description: string
  itemLimit: string
}

const EMPTY: Form = { title: '', type: 'swap', date: '', location: '', description: '', itemLimit: '' }

const TYPE_COLORS: Record<string, string> = {
  swap: 'bg-brand-olive-light text-brand-text',
  drive: 'bg-brand-blue-light text-brand-text',
  meeting: 'bg-brand-lavender-light text-brand-text',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [editing, setEditing] = useState<Event | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<string>('All')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error(`Could not load events (status ${res.status}). Please refresh.`)
      const json = await res.json()
      setEvents(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load events. Please refresh the page.')
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
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          date: form.date,
          location: form.location,
          description: form.description,
          itemLimit: form.itemLimit ? parseInt(form.itemLimit, 10) : 0,
        }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create event. Please check the form and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(event: Event, patch: Partial<Event>) {
    setError(null)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update event. Please try again.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    setError(null)
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete event. Please try again.')
    }
  }

  const visible = filter === 'All' ? events : events.filter((e) => e.type === filter)

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Events"
        subtitle="Create and manage swap events, donation drives, and meetings."
        accentColor="bg-brand-olive"
      />

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">Add Event</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <div className="flex flex-col gap-1">
              <label htmlFor="event-type" className="font-body text-[14px] text-brand-text">Type</label>
              <select
                id="event-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive"
              >
                <option value="swap">Swap</option>
                <option value="drive">Drive</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Date & Time" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Input label="Item Limit (optional)" type="number" value={form.itemLimit} onChange={(e) => setForm({ ...form, itemLimit: e.target.value })} placeholder="e.g. 10" />
          {error && <p className="font-body text-[13px] text-brand-terra">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Event'}
          </Button>
        </form>
      </Card>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-heading text-[16px] font-bold text-brand-text">
          Events ({events.length})
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 font-body text-[13px]"
        >
          <option value="All">All types</option>
          <option value="swap">Swaps</option>
          <option value="drive">Drives</option>
          <option value="meeting">Meetings</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-4 font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="mt-4 font-body text-[14px] text-brand-text/60">No events yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {visible.map((event) => (
            <li key={event.id}>
              <Card className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('px-3 py-1 text-[12px]', TYPE_COLORS[event.type] ?? '')}>
                      {event.type}
                    </Badge>
                    {new Date(event.date) < new Date() && (
                      <span className="font-body text-[11px] text-brand-text/40">Past</span>
                    )}
                  </div>
                  <p className="mt-1 font-heading text-[15px] font-bold text-brand-text">{event.title}</p>
                  <p className="font-body text-[13px] text-brand-text/70">{formatDate(event.date)} · {event.location}</p>
                  {event.description && (
                    <p className="mt-1 font-body text-[12px] text-brand-text/50 line-clamp-2">{event.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(event)}>Edit</Button>
                  <button onClick={() => handleDelete(event.id)} className="font-body text-[13px] text-brand-terra hover:underline">Delete</button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditEventModal
          event={editing}
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

function EditEventModal({ event, onClose, onSave }: { event: Event; onClose: () => void; onSave: (patch: Partial<Event>) => Promise<void> }) {
  const [title, setTitle] = useState(event.title)
  const [type, setType] = useState(event.type)
  const [date, setDate] = useState(event.date.slice(0, 16))
  const [location, setLocation] = useState(event.location)
  const [description, setDescription] = useState(event.description ?? '')
  const [itemLimit, setItemLimit] = useState(String(event.itemLimit ?? ''))
  const [saving, setSaving] = useState(false)

  return (
    <Modal open onClose={onClose} title="Edit Event">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({ title, type, date, location, description, itemLimit: itemLimit ? parseInt(itemLimit, 10) : null })
          } finally {
            setSaving(false)
          }
        }}
        className="flex flex-col gap-4"
      >
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-type" className="font-body text-[14px] text-brand-text">Type</label>
          <select id="edit-type" value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text">
            <option value="swap">Swap</option>
            <option value="drive">Drive</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
        <Input label="Date & Time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <Textarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Item Limit" type="number" value={itemLimit} onChange={(e) => setItemLimit(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
