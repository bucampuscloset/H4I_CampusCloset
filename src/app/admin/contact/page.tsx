'use client'

import { useEffect, useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  type: string
  status: string
  preferredLocation: string | null
  preferredDate: string | null
  preferredTime: string | null
  createdAt: string
  updatedAt: string
}

type SortKey = 'name' | 'email' | 'type' | 'status' | 'createdAt'
type SortDir = 'asc' | 'desc'

const TYPE_LABELS: Record<string, string> = {
  general: 'General',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  responded: 'Responded',
  completed: 'Completed',
}

const TYPE_CLASSES: Record<string, string> = {
  general: 'bg-brand-blue-light text-brand-text border-brand-blue',
  pickup: 'bg-brand-tan-light text-brand-text border-brand-tan',
  dropoff: 'bg-brand-lavender-light text-brand-text border-brand-lavender',
}

const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-brand-olive-light text-brand-text border-brand-olive',
  responded: 'bg-brand-tan-light text-brand-text border-brand-tan',
  completed: 'bg-brand-cream text-brand-text/60 border-brand-text/20',
}

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('border', TYPE_CLASSES[type] ?? 'bg-brand-cream text-brand-text')}
    >
      {TYPE_LABELS[type] ?? type}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('border', STATUS_CLASSES[status] ?? 'bg-brand-cream text-brand-text/60')}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminContactPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewing, setViewing] = useState<ContactRequest | null>(null)
  const [updating, setUpdating] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  async function fetchRequests() {
    setLoading(true)
    try {
      const res = await fetch('/api/contact')
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
      const json = await res.json()
      setRequests(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load contact requests. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function updateStatus(id: string, status: string) {
    setError(null)
    setUpdating(true)
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      const json = await res.json()
      const updated: ContactRequest = json.data
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
      setViewing((prev) => (prev?.id === id ? updated : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update request status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = requests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      req.name.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      req.message.toLowerCase().includes(q)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    let av = a[sortKey] ?? ''
    let bv = b[sortKey] ?? ''
    if (sortKey === 'createdAt') {
      av = new Date(av).getTime().toString()
      bv = new Date(bv).getTime().toString()
    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="ml-1 text-brand-text/30">↕</span>
    return <span className="ml-1 text-brand-olive">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const colHeader = (label: string, key: SortKey) => (
    <th
      className="cursor-pointer select-none px-4 py-3 text-left font-heading text-[13px] font-bold uppercase tracking-wider text-brand-text/60 hover:text-brand-text"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon col={key} />
    </th>
  )

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Contact Inbox"
        subtitle="View and manage incoming contact, pickup, and dropoff requests."
        accentColor="bg-brand-lavender"
      />

      {error && (
        <p className="mt-4 font-body text-[13px] text-brand-terra">{error}</p>
      )}

      {/* Search & filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {['all', 'new', 'responded', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'rounded-md px-3 py-2 font-heading text-[12px] font-semibold transition-colors',
                statusFilter === s
                  ? 'bg-brand-olive text-white'
                  : 'bg-white text-brand-text/60 hover:text-brand-text',
              )}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-body text-[14px] text-brand-text/60">Loading requests...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-body text-[14px] text-brand-text/60">No contact requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-gray-200 bg-brand-cream">
                <tr>
                  {colHeader('Name', 'name')}
                  {colHeader('Email', 'email')}
                  {colHeader('Type', 'type')}
                  {colHeader('Status', 'status')}
                  {colHeader('Date', 'createdAt')}
                  <th className="px-4 py-3 text-left font-heading text-[13px] font-bold uppercase tracking-wider text-brand-text/60">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((req) => (
                  <tr
                    key={req.id}
                    className="transition-colors hover:bg-brand-cream/50"
                  >
                    <td className="px-4 py-3 font-body text-[14px] font-medium text-brand-text">
                      {req.name}
                    </td>
                    <td className="px-4 py-3 font-body text-[14px] text-brand-text/70">
                      {req.email}
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={req.type} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 font-body text-[14px] text-brand-text/60">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="secondary" size="sm" onClick={() => setViewing(req)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <ContactDetailModal
          request={viewing}
          updating={updating}
          onClose={() => setViewing(null)}
          onUpdateStatus={(status) => updateStatus(viewing.id, status)}
        />
      )}
    </div>
  )
}

function ContactDetailModal({
  request,
  updating,
  onClose,
  onUpdateStatus,
}: {
  request: ContactRequest
  updating: boolean
  onClose: () => void
  onUpdateStatus: (status: string) => void
}) {
  const statuses: Array<{ value: string; label: string }> = [
    { value: 'new', label: 'New' },
    { value: 'responded', label: 'Responded' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <Modal open onClose={onClose} title="Contact Request" className="max-w-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={request.type} />
          <StatusBadge status={request.status} />
          <span className="ml-auto font-body text-[13px] text-brand-text/50">
            {formatDate(request.createdAt)}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-body text-[11px] uppercase tracking-wider text-brand-text/50">Name</p>
            <p className="mt-0.5 font-heading text-[15px] font-bold text-brand-text">{request.name}</p>
          </div>
          <div>
            <p className="font-body text-[11px] uppercase tracking-wider text-brand-text/50">Email</p>
            <p className="mt-0.5 font-body text-[14px] text-brand-text">
              <a href={`mailto:${request.email}`} className="hover:underline">
                {request.email}
              </a>
            </p>
          </div>
        </div>

        {(request.preferredLocation || request.preferredDate || request.preferredTime) && (
          <div className="rounded-lg border border-gray-200 bg-brand-cream p-3">
            <p className="mb-2 font-body text-[11px] uppercase tracking-wider text-brand-text/50">
              Preferences
            </p>
            <div className="grid gap-1 sm:grid-cols-3">
              {request.preferredLocation && (
                <div>
                  <p className="font-body text-[11px] text-brand-text/50">Location</p>
                  <p className="font-body text-[13px] text-brand-text">{request.preferredLocation}</p>
                </div>
              )}
              {request.preferredDate && (
                <div>
                  <p className="font-body text-[11px] text-brand-text/50">Date</p>
                  <p className="font-body text-[13px] text-brand-text">{request.preferredDate}</p>
                </div>
              )}
              {request.preferredTime && (
                <div>
                  <p className="font-body text-[11px] text-brand-text/50">Time</p>
                  <p className="font-body text-[13px] text-brand-text">{request.preferredTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <p className="mb-1 font-body text-[11px] uppercase tracking-wider text-brand-text/50">
            Message
          </p>
          <p className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-brand-cream p-3 font-body text-[14px] text-brand-text">
            {request.message}
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            href={`mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(`Re: ${request.type} — Campus Closet`)}&body=${encodeURIComponent(`Hi ${request.name},\n\nThank you for reaching out to Campus Closet.\n\n`)}`}
          >
            Reply
          </Button>
          <p className="mt-1 font-body text-[12px] text-brand-text/50">
            Opens your email app to reply
          </p>
        </div>

        <div>
          <p className="mb-2 font-body text-[12px] uppercase tracking-wider text-brand-text/50">
            Update Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Button
                key={s.value}
                variant={request.status === s.value ? 'primary' : 'secondary'}
                size="sm"
                disabled={updating || request.status === s.value}
                onClick={() => onUpdateStatus(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
