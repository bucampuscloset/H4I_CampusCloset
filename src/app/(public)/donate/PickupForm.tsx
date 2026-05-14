'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface FormState {
  name: string
  email: string
  preferredLocation: string
  preferredDate: string
  preferredTime: string
  notes: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  preferredLocation: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
}

export default function PickupForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pickup',
          name: form.name,
          email: form.email,
          message: form.notes.trim() || 'Pickup request',
          preferredLocation: form.preferredLocation || undefined,
          preferredDate: form.preferredDate || undefined,
          preferredTime: form.preferredTime || undefined,
        }),
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        throw new Error(json.error ?? 'Submission failed')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-olive-light">
          <svg className="h-8 w-8 text-brand-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-body text-[20px] font-extrabold text-brand-text">Request Submitted!</h3>
        <p className="mt-2 font-body text-[16px] text-brand-text/70">
          Your pickup request has been submitted! We&apos;ll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Row 1 — Name + Email */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Your name"
          value={form.name}
          onChange={set('name')}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set('email')}
          required
        />
      </div>

      {/* Row 2 — Preferred Pickup Location */}
      <Input
        label="Preferred Pickup Location"
        placeholder="e.g. Warren Towers lobby, Bay State Rd dorm"
        value={form.preferredLocation}
        onChange={set('preferredLocation')}
      />

      {/* Row 3 — Date + Time */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Preferred Date"
          type="date"
          value={form.preferredDate}
          onChange={set('preferredDate')}
        />
        <Input
          label="Preferred Time"
          type="time"
          value={form.preferredTime}
          onChange={set('preferredTime')}
        />
      </div>

      {/* Row 4 — Notes */}
      <Textarea
        label="Notes"
        placeholder="Add any additional information about your donation or items, days or times you prefer for your pickup."
        value={form.notes}
        onChange={set('notes')}
        rows={4}
      />

      {error && (
        <p role="alert" className="font-body text-[14px] text-brand-terra">{error}</p>
      )}

      <div className="mt-2 flex">
        <Button
          type="submit"
          variant="olive"
          disabled={submitting}
          className="px-10"
        >
          {submitting ? 'Submitting…' : 'Schedule Pickup'}
        </Button>
      </div>
    </form>
  )
}
