'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ImageUpload from '@/components/ui/ImageUpload'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import type { TeamMember } from '@/types'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

type Form = { name: string; role: string; bio: string; photoUrl: string }

const EMPTY: Form = { name: '', role: '', bio: '', photoUrl: '' }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Form>(EMPTY)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/team')
      if (!res.ok) throw new Error(`Could not load team members (status ${res.status}). Please refresh.`)
      const json = await res.json()
      setMembers(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load team members. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, displayOrder: members.length }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add team member. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(member: TeamMember, patch: Partial<TeamMember>) {
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update team member. Please try again.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this team member?')) return
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete team member. Please try again.')
    }
  }

  async function handleReorder(index: number, direction: -1 | 1) {
    const swapWith = members[index + direction]
    const current = members[index]
    if (!swapWith || !current) return
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/team/${current.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: swapWith.displayOrder }),
        }),
        fetch(`/api/team/${swapWith.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: current.displayOrder }),
        }),
      ])
      if (!r1.ok || !r2.ok) throw new Error('Could not reorder team members. Please refresh and try again.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reorder team members. Please refresh and try again.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Team Members"
        subtitle="Manage E-Board bios and photos shown on the About page."
        accentColor="bg-brand-olive"
      />

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">Add Member</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
          </div>
          <ImageUpload
            currentUrl={form.photoUrl}
            onUpload={(url) => setForm({ ...form, photoUrl: url })}
          />
          <Textarea
            label="Bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          {error && <p className="font-body text-[13px] text-brand-terra">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Member'}
          </Button>
        </form>
      </Card>

      <h2 className="mb-4 mt-10 font-heading text-[16px] font-bold text-brand-text">
        Current Team ({members.length})
      </h2>
      {loading ? (
        <p className="font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : members.length === 0 ? (
        <p className="font-body text-[14px] text-brand-text/60">No team members yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {members.map((m, i) => (
            <li key={m.id}>
              <Card className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleReorder(i, -1)}
                    disabled={i === 0}
                    className="text-brand-text/60 hover:text-brand-text disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(i, 1)}
                    disabled={i === members.length - 1}
                    className="text-brand-text/60 hover:text-brand-text disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                {m.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-heading text-[15px] font-bold text-brand-text">{m.name}</p>
                  <p className="font-body text-[13px] text-brand-text/70">{m.role}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setEditing(m)}>
                  Edit
                </Button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="font-body text-[13px] text-brand-terra hover:underline"
                >
                  Delete
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditMemberModal
          member={editing}
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

function EditMemberModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember
  onClose: () => void
  onSave: (patch: Partial<TeamMember>) => Promise<void>
}) {
  const [name, setName] = useState(member.name)
  const [role, setRole] = useState(member.role)
  const [bio, setBio] = useState(member.bio ?? '')
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl ?? '')
  const [saving, setSaving] = useState(false)

  return (
    <Modal open onClose={onClose} title="Edit Member">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({ name, role, bio, photoUrl })
          } finally {
            setSaving(false)
          }
        }}
        className="flex flex-col gap-4"
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
        <ImageUpload
          currentUrl={photoUrl}
          onUpload={(url) => setPhotoUrl(url)}
        />
        <Textarea label="Bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
