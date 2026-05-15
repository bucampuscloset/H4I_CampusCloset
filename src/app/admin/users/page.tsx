'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface AdminUser {
  id: string
  email: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok)
        throw new Error(
          `Could not load admin users (status ${res.status}). Please refresh.`,
        )
      const json = await res.json()
      setUsers(json.data ?? [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load admin users. Please refresh the page.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAdd(e: React.SyntheticEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setEmail('')
      setSuccess('Admin user added successfully.')
      await load()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not add admin user. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, userEmail: string) {
    if (!confirm(`Remove ${userEmail} as an admin?`)) return
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setSuccess('Admin user removed.')
      await load()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not remove admin user. Please try again.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Admin Users"
        subtitle="Manage who has access to the admin portal."
        accentColor="bg-brand-terra"
      />

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">
          Add Admin
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@bu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <p className="font-body text-[13px] text-brand-terra">{error}</p>
          )}
          {success && (
            <p className="font-body text-[13px] text-brand-olive">{success}</p>
          )}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Admin'}
          </Button>
        </form>
      </Card>

      <h2 className="mb-4 mt-10 font-heading text-[16px] font-bold text-brand-text">
        Current Admins ({users.length})
      </h2>
      {loading ? (
        <p className="font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : users.length === 0 ? (
        <p className="font-body text-[14px] text-brand-text/60">
          No admin users yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li key={u.id}>
              <Card className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-heading text-[15px] font-bold text-brand-text">
                    {u.email}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(u.id, u.email)}
                  className="font-body text-[13px] text-brand-terra hover:underline"
                >
                  Remove
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
