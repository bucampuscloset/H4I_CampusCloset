'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

const SUBJECT_OPTIONS = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Pickup Request', value: 'pickup' },
  { label: 'Dropoff Question', value: 'dropoff' },
] as const

type SubjectValue = (typeof SUBJECT_OPTIONS)[number]['value']

interface FormState {
  name: string
  email: string
  subject: SubjectValue
  message: string
  preferredLocation: string
  preferredDate: string
  preferredTime: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  subject: 'general',
  message: '',
  preferredLocation: '',
  preferredDate: '',
  preferredTime: '',
}

const PersonIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const EmailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.message.trim()) errors.message = 'Message is required.'
  return errors
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const needsScheduling = form.subject === 'pickup' || form.subject === 'dropoff'

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      // Clear field error on change
      if (field in fieldErrors) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setStatus('submitting')

    try {
      const body: Record<string, string | undefined> = {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        type: form.subject,
      }

      if (needsScheduling) {
        if (form.preferredLocation.trim()) body.preferredLocation = form.preferredLocation.trim()
        if (form.preferredDate) body.preferredDate = form.preferredDate
        if (form.preferredTime) body.preferredTime = form.preferredTime
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        throw new Error(json.error ?? 'Submission failed')
      }

      setStatus('success')
      setForm(INITIAL)
      setFieldErrors({})
    } catch (err) {
      setStatus('error')
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[20px] px-8 py-16 md:px-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-olive-light">
            <svg className="h-8 w-8 text-brand-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-body text-[22px] font-extrabold text-brand-text">Message Sent!</h3>
          <p className="font-body text-[16px] leading-[1.5] text-brand-text/70">
            Thanks for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Button
            variant="primary"
            onClick={() => setStatus('idle')}
            className="mt-2"
          >
            Send Another Message
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[20px] px-8 py-10 md:px-14 md:py-12">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Row 1 — Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            icon={PersonIcon}
            placeholder="Enter your name"
            value={form.name}
            onChange={set('name')}
            error={fieldErrors.name}
            required
          />
          <Input
            label="Email"
            icon={EmailIcon}
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={set('email')}
            error={fieldErrors.email}
            required
          />
        </div>

        {/* Subject select */}
        <div className="flex flex-col gap-1">
          <label htmlFor="subject" className="font-body text-[14px] text-brand-text">
            Subject
          </label>
          <select
            id="subject"
            value={form.subject}
            onChange={set('subject')}
            className={cn(
              'w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 font-body text-[16px] text-brand-text',
              'focus:border-brand-olive focus:outline-none focus:ring-1 focus:ring-brand-olive',
            )}
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional scheduling fields */}
        {needsScheduling && (
          <div className="flex flex-col gap-4 rounded-lg border border-brand-olive-light bg-brand-cream p-4">
            <p className="font-body text-[13px] text-brand-text/70">
              {form.subject === 'pickup'
                ? 'Let us know when and where works best for your pickup.'
                : 'Let us know when and where works best for your dropoff.'}
            </p>
            <Input
              label="Preferred Location"
              placeholder="e.g. Warren Towers lobby, Bay State Rd dorm"
              value={form.preferredLocation}
              onChange={set('preferredLocation')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        )}

        {/* Message */}
        <Textarea
          label="Message"
          placeholder="How can we help you?"
          rows={5}
          value={form.message}
          onChange={set('message')}
          error={fieldErrors.message}
          required
        />

        {/* Submit error */}
        {status === 'error' && submitError && (
          <p role="alert" className="font-body text-[14px] text-brand-terra">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={status === 'submitting'}
          className="h-[54px] rounded-[10px] font-body text-[20px] font-extrabold tracking-[-0.26px] md:text-[26px]"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  )
}
