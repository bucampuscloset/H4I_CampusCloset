'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/cn'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const BinMap = dynamic(() => import('./BinMap'), {
  ssr: false,
  loading: () => <div className="h-[280px] animate-pulse rounded-lg bg-gray-100" />,
})

// ── Types ──────────────────────────────────────────────────

interface DonationBin {
  id: string
  name: string
  building: string
  latitude: number
  longitude: number
  active: boolean
  createdAt: string
}

interface BinFormState {
  name: string
  building: string
  lat: number | null
  lng: number | null
  active: boolean
}

const EMPTY_FORM: BinFormState = {
  name: '',
  building: '',
  lat: null,
  lng: null,
  active: true,
}

// ── Page ──────────────────────────────────────────────────

export default function AdminBinsPage() {
  const [bins, setBins] = useState<DonationBin[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<DonationBin | null>(null)
  const [form, setForm] = useState<BinFormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ── Data fetching ──────────────────────────────────────

  const fetchBins = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/donations/bins')
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to load bins (${res.status} ${res.statusText}): ${text}`)
      }
      const json = (await res.json()) as { data: DonationBin[] }
      setBins(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load donation bins. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBins() }, [fetchBins])

  // ── Modal helpers ─────────────────────────────────────

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(bin: DonationBin) {
    setEditTarget(bin)
    setForm({ name: bin.name, building: bin.building, lat: bin.latitude, lng: bin.longitude, active: bin.active })
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
  }

  function setField<K extends keyof BinFormState>(key: K, value: BinFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // ── Save ──────────────────────────────────────────────

  async function handleSave() {
    setFormError(null)

    if (!form.name.trim() || !form.building.trim()) {
      setFormError('Name and building are required.')
      return
    }
    if (form.lat === null || form.lng === null) {
      setFormError('Click on the map to place the bin.')
      return
    }

    setSaving(true)
    try {
      const url = editTarget
        ? `/api/donations/bins/${editTarget.id}`
        : '/api/donations/bins'
      const method = editTarget ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          building: form.building,
          latitude: form.lat,
          longitude: form.lng,
          active: form.active,
        }),
      })

      if (!res.ok) {
        throw new Error(await getResponseError(res, 'Could not save donation bin. Please check the form and try again.'))
      }

      closeModal()
      await fetchBins()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/donations/bins/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteId(null)
      await fetchBins()
    } catch {
      setError('Could not delete donation bin. Please try again.')
      setDeleteId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────

  return (
    <div>
      <AdminPageHeader
        title="Donation Bins"
        subtitle="Manage campus drop-off locations."
        accentColor="bg-brand-tan"
      >
        <Button variant="primary" size="sm" onClick={openAdd}>
          + Add Bin
        </Button>
      </AdminPageHeader>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-olive border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-brand-terra/20 bg-brand-terra/5 px-5 py-4">
          <p className="font-body text-[14px] text-brand-terra">{error}</p>
        </div>
      ) : bins.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="font-body text-[15px] text-brand-text/50">No donation bins yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {['Name', 'Building', 'Coordinates', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-heading text-[13px] font-bold uppercase tracking-wide text-brand-text/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bins.map((bin) => (
                <tr key={bin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-body text-[14px] font-medium text-brand-text">
                    {bin.name}
                  </td>
                  <td className="px-4 py-3 font-body text-[14px] text-brand-text/70">
                    {bin.building}
                  </td>
                  <td className="px-4 py-3 font-body text-[13px] text-brand-text/50">
                    {bin.latitude.toFixed(5)}, {bin.longitude.toFixed(5)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={bin.active ? 'filled' : 'outline'}>
                      {bin.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(bin)}
                        className="font-body text-[13px] text-brand-olive hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(bin.id)}
                        className="font-body text-[13px] text-brand-terra hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Donation Bin' : 'Add Donation Bin'}
        className="max-w-xl"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Bin Name"
            placeholder="e.g. Warren Towers Bin"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          <Input
            label="Building"
            placeholder="e.g. Warren Towers"
            value={form.building}
            onChange={(e) => setField('building', e.target.value)}
          />

          {/* Map */}
          <div>
            <p className="mb-1 font-body text-[14px] text-brand-text">
              Click on the map to place the bin
            </p>
            <div className="h-[280px] overflow-hidden rounded-lg border border-gray-300">
              <BinMap
                lat={form.lat}
                lng={form.lng}
                onMapClick={(lat, lng) => {
                  setField('lat', lat)
                  setField('lng', lng)
                }}
              />
            </div>
            {form.lat !== null && form.lng !== null && (
              <p className="mt-1 font-body text-[12px] text-brand-text/50">
                {form.lat.toFixed(6)}, {form.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Active toggle */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField('active', e.target.checked)}
              className="h-4 w-4 accent-brand-olive"
            />
            <span className="font-body text-[14px] text-brand-text">Active (visible on public map)</span>
          </label>

          {formError && (
            <p className="font-body text-[13px] text-brand-terra">{formError}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Bin'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Bin"
      >
        <p className="font-body text-[15px] text-brand-text/70">
          Are you sure you want to delete this bin? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={() => deleteId && handleDelete(deleteId)}
            className="bg-brand-terra hover:opacity-90"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
