'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import type { GalleryPhoto } from '@/types'
import { getResponseError } from '@/lib/safe-json'

type Form = { caption: string; eventId: string }

const EMPTY: Form = { caption: '', eventId: '' }

type EventOption = { id: string; title: string }

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Form>(EMPTY)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<GalleryPhoto | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [photosRes, eventsRes] = await Promise.all([
        fetch('/api/photos'),
        fetch('/api/events'),
      ])
      if (!photosRes.ok) throw new Error(`Failed to load photos: ${photosRes.status}`)
      if (!eventsRes.ok) throw new Error(`Failed to load events: ${eventsRes.status}`)
      const [photosJson, eventsJson] = await Promise.all([photosRes.json(), eventsRes.json()])
      setPhotos(photosJson.data ?? [])
      setEvents(eventsJson.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load photos. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
    e.target.value = ''
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('Please select a photo to upload.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'gallery')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error(await getResponseError(uploadRes, 'Image upload failed. The file may be too large (max 4 MB) or in an unsupported format.'))
      const uploadJson = await uploadRes.json()

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadJson.url,
          caption: form.caption || undefined,
          eventId: form.eventId || undefined,
        }),
      })
      if (!res.ok) {
        // Clean up the already-uploaded file to avoid orphaned storage objects
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: uploadJson.url }),
        }).catch(() => {})
        throw new Error(await getResponseError(res, 'Failed'))
      }
      setForm(EMPTY)
      setFile(null)
      setPreview(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save photo. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(photo: GalleryPhoto, patch: Partial<GalleryPhoto>) {
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
    await load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    try {
      const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete photo. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-[28px] text-brand-brown">Photo Gallery</h1>
      <p className="mt-2 font-body text-[14px] text-brand-text/60">
        Manage photos shown on the About page and landing gallery.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">Add Photo</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {/* File upload */}
          <div>
            <p className="mb-1 font-body text-[14px] text-brand-text">Photo</p>
            {preview ? (
              <div className="relative mb-2 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null) }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-brand-olive hover:bg-brand-cream"
              >
                <div className="text-center">
                  <svg className="mx-auto mb-2 h-8 w-8 text-brand-text/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="font-body text-[14px] text-brand-text/50">
                    Click to upload a photo
                  </p>
                  <p className="font-body text-[12px] text-brand-text/30">
                    JPG, PNG, WebP, GIF — max 5 MB
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <Input
            label="Caption (optional)"
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="font-body text-[14px] text-brand-text">Tag with event (optional)</label>
            <select
              value={form.eventId}
              onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text"
            >
              <option value="">— None —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="font-body text-[13px] text-brand-terra">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting || !file}>
            {submitting ? 'Uploading...' : 'Add Photo'}
          </Button>
        </form>
      </Card>

      <h2 className="mb-4 mt-10 font-heading text-[16px] font-bold text-brand-text">
        Gallery ({photos.length})
      </h2>
      {loading ? (
        <p className="font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : photos.length === 0 ? (
        <p className="font-body text-[14px] text-brand-text/60">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.caption ?? 'Gallery photo'}
                className="aspect-square w-full object-cover"
              />
              <div className="p-3">
                {p.caption && (
                  <p className="mb-2 font-body text-[12px] text-brand-text/70 line-clamp-2">
                    {p.caption}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(p)}
                    className="font-body text-[12px] text-brand-blue hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="font-body text-[12px] text-brand-terra hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <EditPhotoModal
          photo={editing}
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

function EditPhotoModal({
  photo,
  events,
  onClose,
  onSave,
}: {
  photo: GalleryPhoto
  events: { id: string; title: string }[]
  onClose: () => void
  onSave: (patch: Partial<GalleryPhoto>) => Promise<void>
}) {
  const [caption, setCaption] = useState(photo.caption ?? '')
  const [eventId, setEventId] = useState(photo.eventId ?? '')
  const [saving, setSaving] = useState(false)

  return (
    <Modal open onClose={onClose} title="Edit Photo">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({
              caption: caption === '' ? null : caption,
              eventId: eventId === '' ? null : eventId,
            })
          } finally {
            setSaving(false)
          }
        }}
        className="flex flex-col gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.caption ?? ''} className="aspect-square w-full rounded-md object-cover" />
        <Input
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="font-body text-[14px] text-brand-text">Tag with event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text"
          >
            <option value="">— None —</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>
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
