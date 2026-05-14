'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { getResponseError } from '@/lib/safe-json'

interface ContentEntry {
  id: string
  key: string
  value: string
  updatedAt: string
}

// Content sections with their keys, labels, and default values
const CONTENT_SECTIONS = [
  {
    heading: 'Footer & Contact',
    items: [
      { key: 'footer.email', label: 'Contact Email', default: 'campuscloset@bu.edu' },
      { key: 'footer.instagram_url', label: 'Instagram URL', default: 'https://www.instagram.com/bucampuscloset/' },
      { key: 'footer.instagram_handle', label: 'Instagram Handle', default: '@bucampuscloset' },
      { key: 'footer.tagline', label: 'Footer Tagline', default: 'A sustainability-focused clothing swap initiative at Boston University.' },
    ],
  },
  {
    heading: 'Hero Section',
    items: [
      { key: 'hero.badge', label: 'Badge Text', default: 'STUDENT-RUN INITIATIVE' },
      { key: 'hero.headline', label: 'Headline (use *italic* for emphasis)', default: 'The community *for sustainable* fashion at BU' },
      { key: 'hero.subtitle', label: 'Subtitle', default: 'Swap, donate, and discover clothing while reducing fast fashion and building a better campus.' },
    ],
  },
  {
    heading: 'About Page',
    items: [
      { key: 'about.tagline', label: 'About Tagline', default: 'Est. 2021 | Our mission is to cultivate community and environmental responsibility through free, sustainable, and circular clothing consumption.' },
      { key: 'about.join_heading', label: '"Join the Team" Heading', default: 'Want to join the team?' },
      { key: 'about.join_body', label: '"Join the Team" Body', default: "We're always looking for passionate students to help organize swaps, run drives, and grow the Campus Closet community. Applications open each semester." },
    ],
  },
  {
    heading: 'Mission Section',
    items: [
      { key: 'mission.body1', label: 'Mission Paragraph 1', default: 'Campus Closet was founded on a simple belief: clothing should be shared, not wasted. As fast fashion fuels overconsumption and closets overflow, many students still struggle to access affordable options. We\'re working to break that cycle through free, circular clothing swaps that extend garment lifespans and reduce textile waste.' },
      { key: 'mission.body2', label: 'Mission Paragraph 2', default: 'By making contribution the currency instead of cash, we strengthen both community and environmental responsibility. Now as Campus Closet, we\'re expanding beyond Boston University to partner with other campuses and organizations, growing access to sustainable, free clothing wherever it\'s needed.' },
    ],
  },
  {
    heading: 'Donate Page',
    items: [
      { key: 'donate.accept_items', label: 'Accepted Items (one per line)', default: 'Tops (t-shirts, blouses, long sleeves)\nBottoms (jeans, pants, skirts, shorts)\nDresses & jumpsuits\nSweaters & hoodies\nJackets & coats' },
      { key: 'donate.reject_items', label: 'Rejected Items (one per line)', default: 'Undergarments\nShoes\nBedding or linens\nHeavily damaged items' },
    ],
  },
  {
    heading: 'Events Page',
    items: [
      { key: 'events.swap_purpose', label: 'Swap — Purpose', default: 'Let students browse and take free clothing.' },
      { key: 'events.swap_what', label: 'Swap — What Happens', default: 'Students attend an in-person event to browse, swap, and take items.' },
      { key: 'events.drive_purpose', label: 'Drive — Purpose', default: 'Collect clothing donations across campus.' },
      { key: 'events.drive_what', label: 'Drive — What Happens', default: 'Students donate clothing at bins or drives. The BU Campus Closet team sorts and stores items.' },
      { key: 'events.guidelines', label: 'General Guidelines (one per line)', default: 'No undergarments, shoes, bedding, or accessories\nBring clean, gently-used clothing in good condition' },
    ],
  },
  {
    heading: 'Landing — Footer CTA',
    items: [
      { key: 'cta.heading', label: 'CTA Heading', default: 'Ready to Make a Difference?' },
      { key: 'cta.body', label: 'CTA Body', default: 'Join hundreds of BU Students in building a more sustainable campus through fashion' },
    ],
  },
  {
    heading: 'FAQ Page',
    items: [
      { key: 'faq.response_time', label: 'Response Time Promise', default: "We'll get back to you within 24 hours." },
    ],
  },
]

export default function AdminContentPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const section of CONTENT_SECTIONS) {
      for (const item of section.items) {
        defaults[item.key] = item.default
      }
    }
    return defaults
  })

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/site-content')
      if (!res.ok) throw new Error('Could not load site content. Please refresh the page.')
      const json = await res.json()
      setEntries(json.data ?? [])
      setValues((prev) => {
        const next = { ...prev }
        for (const entry of json.data ?? []) {
          next[entry.key] = entry.value
        }
        return next
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load site content. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function getValue(key: string) {
    return values[key] ?? ''
  }

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(key: string) {
    setSaving(key)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] }),
      })
      if (!res.ok) throw new Error(await getResponseError(res, 'Failed'))
      setSuccess(`Saved "${key}"`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save content changes. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  function isModified(key: string, defaultValue: string) {
    const dbValue = entries.find((e) => e.key === key)?.value
    const baseline = dbValue ?? defaultValue
    return values[key] !== baseline
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-[28px] text-brand-brown">Site Content</h1>
        <p className="mt-4 font-body text-[14px] text-brand-text/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-[28px] text-brand-brown">Site Content</h1>
      <p className="mt-2 font-body text-[14px] text-brand-text/60">
        Edit publicly-visible text across the site. Changes appear within 60 seconds.
      </p>

      {error && <p className="mt-4 font-body text-[13px] text-brand-terra">{error}</p>}
      {success && <p className="mt-4 font-body text-[13px] text-brand-olive">{success}</p>}

      {CONTENT_SECTIONS.map((section) => (
        <Card key={section.heading} className="mt-8 p-6">
          <h2 className="mb-4 font-heading text-[16px] font-bold text-brand-text">{section.heading}</h2>
          <div className="flex flex-col gap-5">
            {section.items.map((item) => {
              const isLong = item.default.length > 100 || item.default.includes('\n')
              return (
                <div key={item.key}>
                  {isLong ? (
                    <Textarea
                      label={item.label}
                      rows={Math.min(8, Math.max(3, item.default.split('\n').length + 1))}
                      value={getValue(item.key)}
                      onChange={(e) => setValue(item.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      label={item.label}
                      value={getValue(item.key)}
                      onChange={(e) => setValue(item.key, e.target.value)}
                    />
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={saving === item.key || !isModified(item.key, item.default)}
                      onClick={() => handleSave(item.key)}
                    >
                      {saving === item.key ? 'Saving...' : 'Save'}
                    </Button>
                    <span className="font-body text-[11px] text-brand-text/40">{item.key}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
