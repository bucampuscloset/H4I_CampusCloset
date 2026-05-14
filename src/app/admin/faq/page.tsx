'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { FAQ_CATEGORIES } from '@/types'
import type { FaqItem } from '@/types'
import { getResponseError } from '@/lib/safe-json'

type Form = { question: string; answer: string; category: string }

const EMPTY: Form = { question: '', answer: '', category: FAQ_CATEGORIES[0] }

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Form>(EMPTY)
  const [editing, setEditing] = useState<FaqItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/faq')
      if (!res.ok) throw new Error(`Could not load FAQ items (status ${res.status}). Please refresh.`)
      const json = await res.json()
      setItems(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load FAQ items. Please refresh the page.')
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
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, displayOrder: items.length }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setForm(EMPTY)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create FAQ item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(item: FaqItem, patch: Partial<FaqItem>) {
    try {
      const res = await fetch(`/api/faq/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update FAQ item. Please try again.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ item?')) return
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await getResponseError(res, `Failed: ${res.status}`))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete FAQ item. Please try again.')
    }
  }

  async function handleReorder(index: number, direction: -1 | 1) {
    const swapWith = visible[index + direction]
    const current = visible[index]
    if (!swapWith || !current) return
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/faq/${current.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: swapWith.displayOrder }),
        }),
        fetch(`/api/faq/${swapWith.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: current.displayOrder }),
        }),
      ])
      if (!r1.ok || !r2.ok) throw new Error('Could not reorder FAQ items. Please refresh and try again.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reorder FAQ items. Please refresh and try again.')
    }
  }

  const visible = filter === 'All' ? items : items.filter((i) => i.category === filter)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-[28px] text-brand-brown">FAQ</h1>
      <p className="mt-2 font-body text-[14px] text-brand-text/60">
        Add and edit questions shown on the FAQ page.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">Add Question</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
          <Textarea
            label="Answer"
            rows={4}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="font-body text-[14px] text-brand-text">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive"
            >
              {FAQ_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="font-body text-[13px] text-brand-terra">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Question'}
          </Button>
        </form>
      </Card>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-heading text-[16px] font-bold text-brand-text">
          Current FAQ ({items.length})
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 font-body text-[13px]"
        >
          <option value="All">All categories</option>
          {FAQ_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-4 font-body text-[14px] text-brand-text/60">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="mt-4 font-body text-[14px] text-brand-text/60">No questions yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {visible.map((item, i) => (
            <li key={item.id}>
              <Card className="flex items-start gap-4 p-4">
                <div className="flex flex-col gap-1 pt-1">
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
                    disabled={i === visible.length - 1}
                    className="text-brand-text/60 hover:text-brand-text disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1">
                  <p className="font-body text-[11px] uppercase tracking-wider text-brand-text/50">
                    {item.category}
                  </p>
                  <p className="mt-1 font-heading text-[15px] font-bold text-brand-text">
                    {item.question}
                  </p>
                  <p className="mt-1 font-body text-[13px] text-brand-text/70">{item.answer}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(item)}>
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="font-body text-[13px] text-brand-terra hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditFaqModal
          item={editing}
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

function EditFaqModal({
  item,
  onClose,
  onSave,
}: {
  item: FaqItem
  onClose: () => void
  onSave: (patch: Partial<FaqItem>) => Promise<void>
}) {
  const [question, setQuestion] = useState(item.question)
  const [answer, setAnswer] = useState(item.answer)
  const [category, setCategory] = useState(item.category)
  const [saving, setSaving] = useState(false)

  return (
    <Modal open onClose={onClose} title="Edit Question">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({ question, answer, category })
          } finally {
            setSaving(false)
          }
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <Textarea
          label="Answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="font-body text-[14px] text-brand-text">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2.5 font-body text-[16px] text-brand-text"
          >
            {FAQ_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
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
