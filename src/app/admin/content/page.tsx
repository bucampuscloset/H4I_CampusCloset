'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { getResponseError } from '@/lib/safe-json'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { cn } from '@/lib/cn'

interface ContentEntry {
  id: string
  key: string
  value: string
  updatedAt: string
}

// Page-level tabs for organizing content sections
const CONTENT_TABS = [
  {
    id: 'landing',
    label: 'Landing',
    sections: [
      {
        heading: 'Hero Section',
        items: [
          { key: 'hero.badge', label: 'Badge Text', default: 'STUDENT-RUN INITIATIVE' },
          { key: 'hero.headline', label: 'Headline (use *italic* for emphasis)', default: 'The community *for sustainable* fashion at BU' },
          { key: 'hero.subtitle', label: 'Subtitle', default: 'Swap, donate, and discover clothing while reducing fast fashion and building a better campus.' },
        ],
      },
      {
        heading: 'What is Campus Closet',
        items: [
          { key: 'landing.what_heading', label: 'Heading', default: 'What is Campus Closet?' },
          { key: 'landing.what_subtitle', label: 'Subtitle', default: 'A student-run sustainability initiative at Boston University promoting circular fashion through free, recurring clothing swaps.' },
          { key: 'landing.pillar1_title', label: 'Pillar 1 Title', default: 'Free Clothing Swaps' },
          { key: 'landing.pillar1_desc', label: 'Pillar 1 Description', default: 'Exchange clothes with fellow students at no cost, sustainable fashion made easy.' },
          { key: 'landing.pillar2_title', label: 'Pillar 2 Title', default: 'Sustainability First' },
          { key: 'landing.pillar2_desc', label: 'Pillar 2 Description', default: 'Keep clothing out of landfills by donating and swapping items on campus.' },
          { key: 'landing.pillar3_title', label: 'Pillar 3 Title', default: 'Student-Run' },
          { key: 'landing.pillar3_desc', label: 'Pillar 3 Description', default: 'Built by students, for students—creating a sustainable campus together.' },
        ],
      },
      {
        heading: 'How It Works',
        items: [
          { key: 'landing.how_heading', label: 'Heading', default: 'How it Works' },
          { key: 'landing.how_subtitle', label: 'Subtitle', default: 'Three Simple Steps to Sustainable Fashion!' },
          { key: 'landing.step1_title', label: 'Step 1 Title', default: 'Donate' },
          { key: 'landing.step1_desc', label: 'Step 1 Description', default: 'Bring clothes to donate!' },
          { key: 'landing.step2_title', label: 'Step 2 Title', default: 'Swap & Discover' },
          { key: 'landing.step2_desc', label: 'Step 2 Description', default: 'Explore curated racks and take what you love.' },
          { key: 'landing.step3_title', label: 'Step 3 Title', default: 'Feel Good About It' },
          { key: 'landing.step3_desc', label: 'Step 3 Description', default: 'Reduce waste and support a more sustainable campus.' },
        ],
      },
      {
        heading: 'Why It Matters',
        items: [
          { key: 'landing.why_heading', label: 'Heading', default: 'Why it Matters?' },
          { key: 'landing.why_body', label: 'Body Text', default: "The fashion industry is one of the world's most polluting industries. By swapping instead of buying, you help reduce waste, conserve water, and lower carbon emissions — one outfit at a time." },
        ],
      },
      {
        heading: 'Get Involved',
        items: [
          { key: 'landing.involved_heading', label: 'Heading', default: 'How Can You Get Involved?' },
          { key: 'landing.involved_subtitle', label: 'Subtitle', default: 'Campus Closet is a sustainability initiative on campus, aiming to promote sustainable fashion and circular consumption through free clothing swaps on campus.' },
          { key: 'landing.action1_title', label: 'Card 1 Title', default: 'Attend a Swap' },
          { key: 'landing.action1_desc', label: 'Card 1 Description', default: 'Exchange clothes with fellow students at no cost, sustainable fashion made easy.' },
          { key: 'landing.action2_title', label: 'Card 2 Title', default: 'Donate Clothes' },
          { key: 'landing.action2_desc', label: 'Card 2 Description', default: 'Keep clothing out of landfills by donating and swapping items on campus.' },
          { key: 'landing.action3_title', label: 'Card 3 Title', default: 'Join the Team' },
          { key: 'landing.action3_desc', label: 'Card 3 Description', default: 'Built by students, for students—creating a sustainable campus together.' },
        ],
      },
      {
        heading: 'Gallery & FAQ Preview',
        items: [
          { key: 'landing.gallery_heading', label: 'Gallery Heading', default: 'See Us in Action' },
          { key: 'landing.gallery_subtitle', label: 'Gallery Subtitle', default: 'Campus Closet is a sustainability initiative on campus, aiming to promote sustainable fashion and circular consumption through free clothing swaps on campus.' },
          { key: 'landing.faq_heading', label: 'FAQ Heading', default: 'Frequently Asked Questions' },
          { key: 'landing.faq_subtitle', label: 'FAQ Subtitle', default: 'Quick answers to the most common questions about Campus Closet.' },
        ],
      },
      {
        heading: 'Footer CTA',
        items: [
          { key: 'cta.heading', label: 'CTA Heading', default: 'Ready to Make a Difference?' },
          { key: 'cta.body', label: 'CTA Body', default: 'Join hundreds of BU Students in building a more sustainable campus through fashion' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    sections: [
      {
        heading: 'Page Header',
        items: [
          { key: 'about.tagline', label: 'About Tagline', default: 'Est. 2021 | Our mission is to cultivate community and environmental responsibility through free, sustainable, and circular clothing consumption.' },
          { key: 'about.join_heading', label: '"Join the Team" Heading', default: 'Want to join the team?' },
          { key: 'about.join_body', label: '"Join the Team" Body', default: "We're always looking for passionate students to help organize swaps, run drives, and grow the Campus Closet community. Applications open each semester." },
        ],
      },
      {
        heading: 'Mission Section',
        items: [
          { key: 'mission.label', label: 'Section Label', default: '[ OUR MISSION ]' },
          { key: 'mission.heading', label: 'Main Heading', default: 'REDUCING CONSUMPTION' },
          { key: 'mission.tagline', label: 'Italic Tagline', default: 'Expanding Access.' },
          { key: 'mission.body1', label: 'Mission Paragraph 1', default: 'Campus Closet was founded on a simple belief: clothing should be shared, not wasted. As fast fashion fuels overconsumption and closets overflow, many students still struggle to access affordable options. We\u2019re working to break that cycle through free, circular clothing swaps that extend garment lifespans and reduce textile waste.' },
          { key: 'mission.body2', label: 'Mission Paragraph 2', default: 'By making contribution the currency instead of cash, we strengthen both community and environmental responsibility. Now as Campus Closet, we\u2019re expanding beyond Boston University to partner with other campuses and organizations, growing access to sustainable, free clothing wherever it\u2019s needed.' },
          { key: 'mission.pillar1_title', label: 'Pillar 1 Title', default: 'Sustainability' },
          { key: 'mission.pillar1_desc', label: 'Pillar 1 Description', default: 'Reducing textile waste on campus' },
          { key: 'mission.pillar2_title', label: 'Pillar 2 Title', default: 'Community' },
          { key: 'mission.pillar2_desc', label: 'Pillar 2 Description', default: 'Building connections through sharing' },
          { key: 'mission.pillar3_title', label: 'Pillar 3 Title', default: 'Accessibility' },
          { key: 'mission.pillar3_desc', label: 'Pillar 3 Description', default: 'Free clothing for all students' },
        ],
      },
      {
        heading: 'Impact & Team',
        items: [
          { key: 'about.impact_heading', label: 'Impact Heading', default: 'Our Impact' },
          { key: 'about.impact_subtitle', label: 'Impact Subtitle', default: 'Since our launch, Campus Closet has made significant steps in promoting sustainable fashion.' },
          { key: 'about.team_heading', label: 'Team Heading', default: 'Meet the E-Board' },
          { key: 'about.team_subtitle', label: 'Team Subtitle', default: 'A dedicated team of students passionate about sustainability, fashion, and community.' },
        ],
      },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    sections: [
      {
        heading: 'Page Headings',
        items: [
          { key: 'events.page_heading', label: 'Page Heading', default: 'Events' },
          { key: 'events.page_subtitle', label: 'Page Subtitle', default: 'Find upcoming clothing swaps, donation drives, and more campus closet events!' },
          { key: 'events.upcoming_heading', label: 'Upcoming Section Heading', default: 'Upcoming Swaps and Drives' },
          { key: 'events.upcoming_subtitle', label: 'Upcoming Section Subtitle', default: 'Join us at our next clothing swap!' },
          { key: 'events.no_events', label: 'No Events Message', default: 'No upcoming events - check back soon.' },
        ],
      },
      {
        heading: 'Swap vs. Drive',
        items: [
          { key: 'events.swap_purpose', label: 'Swap — Purpose', default: 'Let students browse and take free clothing.' },
          { key: 'events.swap_what', label: 'Swap — What Happens', default: 'Students attend an in-person event to browse, swap, and take items.' },
          { key: 'events.drive_purpose', label: 'Drive — Purpose', default: 'Collect clothing donations across campus.' },
          { key: 'events.drive_what', label: 'Drive — What Happens', default: 'Students donate clothing at bins or drives. The BU Campus Closet team sorts and stores items.' },
          { key: 'events.guidelines', label: 'General Guidelines (one per line)', default: 'No undergarments, shoes, bedding, or accessories\nBring clean, gently-used clothing in good condition' },
        ],
      },
    ],
  },
  {
    id: 'donate',
    label: 'Donate',
    sections: [
      {
        heading: 'Page Headings',
        items: [
          { key: 'donate.hero_heading', label: 'Hero Heading', default: 'Donate Clothes' },
          { key: 'donate.hero_subtitle', label: 'Hero Subtitle', default: "Help keep clothing out of landfills and make sustainable fashion accessible to BU students. Your donations make our swaps possible." },
          { key: 'donate.how_heading', label: 'How to Donate Heading', default: 'How to Donate' },
          { key: 'donate.how_subtitle', label: 'How to Donate Subtitle', default: 'Simple steps to make your clothing donation count!' },
          { key: 'donate.step1_title', label: 'Step 1 Title', default: '1. Check Quality' },
          { key: 'donate.step1_desc', label: 'Step 1 Description', default: 'Ensure items are clean, wearable, and in good condition before donating.' },
          { key: 'donate.step2_title', label: 'Step 2 Title', default: '2. Drop Off or Schedule' },
          { key: 'donate.step2_desc', label: 'Step 2 Description', default: 'Find a campus bin near you or schedule a free pickup at your building.' },
          { key: 'donate.step3_title', label: 'Step 3 Title', default: '3. We Handle the Rest' },
          { key: 'donate.step3_desc', label: 'Step 3 Description', default: 'We sort, display, and redistribute your items at our next swap event.' },
          { key: 'donate.locations_heading', label: 'Locations Heading', default: 'Drop-Off Locations' },
          { key: 'donate.locations_subtitle', label: 'Locations Subtitle', default: 'Find convenient donation bins across BU campus' },
          { key: 'donate.pickup_heading', label: 'Pickup Heading', default: 'Schedule a Pickup' },
          { key: 'donate.pickup_subtitle', label: 'Pickup Subtitle', default: "Can't make it to a bin? Request a pickup and we'll coordinate a time." },
          { key: 'donate.questions_heading', label: 'Questions Heading', default: 'Questions?' },
          { key: 'donate.questions_subtitle', label: 'Questions Subtitle', default: "We're here to help with any questions about donating to BU Campus Closet." },
        ],
      },
      {
        heading: 'Accepted & Rejected Items',
        items: [
          { key: 'donate.accept_items', label: 'Accepted Items (one per line)', default: 'Tops (t-shirts, blouses, long sleeves)\nBottoms (jeans, pants, skirts, shorts)\nDresses & jumpsuits\nSweaters & hoodies\nJackets & coats' },
          { key: 'donate.reject_items', label: 'Rejected Items (one per line)', default: 'Undergarments\nShoes\nBedding or linens\nHeavily damaged items' },
        ],
      },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    sections: [
      {
        heading: 'Page Content',
        items: [
          { key: 'faq.page_heading', label: 'Page Heading', default: 'Frequently Asked Questions' },
          { key: 'faq.page_subtitle', label: 'Page Subtitle', default: "Have questions about how Campus Closet works? We've got answers." },
          { key: 'faq.still_heading', label: 'Still Questions Heading', default: 'Still have questions?' },
          { key: 'faq.still_body', label: 'Still Questions Body', default: "Can't find the answer you're looking for? Reach out to us directly." },
          { key: 'faq.response_time', label: 'Response Time Promise', default: "We'll get back to you within 24 hours." },
        ],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    sections: [
      {
        heading: 'Page Hero',
        items: [
          { key: 'contact.heading', label: 'Hero Heading', default: 'Get in Touch' },
          { key: 'contact.subtitle', label: 'Hero Subtitle', default: "Have a question, want to request a pickup, or just want to say hi? Fill out the form below and we'll get back to you within 24 hours." },
          { key: 'contact.info_heading', label: 'Contact Info Heading', default: 'Other Ways to Reach Us' },
        ],
      },
    ],
  },
  {
    id: 'global',
    label: 'Global',
    sections: [
      {
        heading: 'Footer & Contact Info',
        items: [
          { key: 'footer.email', label: 'Contact Email', default: 'campuscloset@bu.edu' },
          { key: 'footer.instagram_url', label: 'Instagram URL', default: 'https://www.instagram.com/bucampuscloset/' },
          { key: 'footer.instagram_handle', label: 'Instagram Handle', default: '@bucampuscloset' },
          { key: 'footer.tagline', label: 'Footer Tagline', default: 'A sustainability-focused clothing swap initiative at Boston University.' },
        ],
      },
    ],
  },
]

// Flatten all sections for initializing defaults
const ALL_SECTIONS = CONTENT_TABS.flatMap((tab) => tab.sections)

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState(CONTENT_TABS[0].id)
  const [entries, setEntries] = useState<ContentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const section of ALL_SECTIONS) {
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
        <AdminPageHeader
          title="Site Content"
          subtitle="Edit publicly-visible text across the site. Changes appear within 60 seconds."
          accentColor="bg-brand-lavender"
        />
        <p className="font-body text-[14px] text-brand-text/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Site Content"
        subtitle="Edit publicly-visible text across the site. Changes appear within 60 seconds."
        accentColor="bg-brand-lavender"
      />

      {error && <p className="mt-4 font-body text-[13px] text-brand-terra">{error}</p>}
      {success && <p className="mt-4 font-body text-[13px] text-brand-olive">{success}</p>}

      {/* Page tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg bg-brand-cream p-1">
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'whitespace-nowrap rounded-md px-4 py-2 font-heading text-[13px] font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-white text-brand-text shadow-sm'
                : 'text-brand-text/50 hover:text-brand-text/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections for active tab */}
      {CONTENT_TABS.find((t) => t.id === activeTab)?.sections.map((section) => (
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
