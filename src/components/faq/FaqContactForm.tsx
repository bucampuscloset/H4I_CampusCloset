'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

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

export default function FaqContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: `[${subject || 'General Inquiry'}] ${message}`,
          type: 'general',
        }),
      })
      if (!res.ok) throw new Error('Your message could not be sent. Please try again.')
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong while sending your message.')
    }
  }

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[20px] px-8 py-10 md:px-14 md:py-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            icon={PersonIcon}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            icon={EmailIcon}
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Input
          label="Subject"
          placeholder="General Inquiry"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          label="Message"
          placeholder="How can we help you?"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={status === 'submitting'}
          className="h-[54px] rounded-[10px] font-body text-[20px] font-extrabold tracking-[-0.26px] md:text-[26px]"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
        {status === 'success' && (
          <p role="alert" className="text-center font-body text-[14px] text-brand-olive">
            Thanks! We&apos;ll get back to you within 24 hours.
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="text-center font-body text-[14px] text-brand-terra">
            {error ?? 'We couldn\'t send your message. Please check your connection and try again.'}
          </p>
        )}
      </form>
    </Card>
  )
}
