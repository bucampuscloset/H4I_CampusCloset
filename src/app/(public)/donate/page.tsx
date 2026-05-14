import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { getContentMap } from '@/lib/site-content'
import PickupForm from './PickupForm'
import DonationMapWrapper from './DonationMapWrapper'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Donate | Campus Closet',
  description: 'Donate clothing to BU Campus Closet. Find donation bins across campus, learn what we accept, and schedule a free pickup.',
}

// ── SVG Icons ─────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  )
}

function HandsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────

const DEFAULT_ACCEPT = 'Tops (t-shirts, blouses, long sleeves)\nBottoms (jeans, pants, skirts, shorts)\nDresses & jumpsuits\nSweaters & hoodies\nJackets & coats'

const DEFAULT_REJECT = 'Undergarments\nShoes\nBedding or linens\nHeavily damaged items'

const HOW_STEPS = [
  {
    icon: <CheckIcon className="h-8 w-8 text-white" />,
    bg: 'bg-brand-olive',
    label: '1. Check Quality',
    desc: 'Ensure items are clean, wearable, and in good condition before donating.',
  },
  {
    icon: <BoxIcon className="h-8 w-8 text-white" />,
    bg: 'bg-brand-tan',
    label: '2. Drop Off or Schedule',
    desc: 'Find a campus bin near you or schedule a free pickup at your building.',
  },
  {
    icon: <HandsIcon className="h-8 w-8 text-white" />,
    bg: 'bg-brand-olive-light',
    label: '3. We Handle the Rest',
    desc: 'We sort, display, and redistribute your items at our next swap event.',
  },
]

// Shared container — every section uses this
const INNER = 'mx-auto max-w-5xl px-6 lg:px-12'

// ── Page ──────────────────────────────────────────────────

export default async function DonatePage() {
  const content = await getContentMap({
    'donate.accept_items': DEFAULT_ACCEPT,
    'donate.reject_items': DEFAULT_REJECT,
  })
  const ACCEPT_ITEMS = content['donate.accept_items'].split('\n').filter(Boolean)
  const REJECT_ITEMS = content['donate.reject_items'].split('\n').filter(Boolean)

  return (
    <>
      {/* ── Section 1: Hero ─────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className={cn(INNER, 'text-center')}>
          <h1 className="font-display text-[48px] leading-[1.05] text-brand-text md:text-[64px]">
            Donate Clothes
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-brand-text/70">
            Help keep clothing out of landfills and make sustainable fashion accessible to
            BU students. Your donations make our swaps possible.
          </p>
        </div>
      </section>

      {/* ── Green divider bar ───────────────────────────── */}
      <div className="h-9 w-full bg-brand-olive-light border-y-2 border-brand-brown" />

      {/* ── Section 2: How to Donate ────────────────────── */}
      <section className="bg-white py-20">
        <div className={cn(INNER, 'text-center')}>
          <h2 className="font-display text-[40px] text-brand-text md:text-[52px]">How to Donate</h2>
          <p className="mt-3 font-body text-brand-text/70">
            Simple steps to make your clothing donation count!
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_STEPS.map((step) => (
              <div key={step.label} className="flex flex-col items-center text-center">
                <div className={cn('flex h-16 w-16 items-center justify-center rounded-full', step.bg)}>
                  {step.icon}
                </div>
                <p className="mt-4 font-body text-[17px] font-extrabold text-brand-text">
                  {step.label}
                </p>
                <p className="mt-2 font-body text-sm text-brand-text/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: What We Accept ───────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className={INNER}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Accept */}
            <Card variant="outlined" className="p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-olive">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-body text-xl font-extrabold text-brand-text">What We Accept</h3>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {ACCEPT_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-olive" />
                    <span className="font-body text-[15px] text-brand-text">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-body text-sm text-brand-text/60">
                All items should be clean and in good condition.
              </p>
            </Card>

            {/* Reject */}
            <Card variant="outlined" className="p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-brown">
                  <XIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-body text-xl font-extrabold text-brand-text">
                  What We Don&apos;t Accept
                </h3>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {REJECT_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-text/40" />
                    <span className="font-body text-[15px] text-brand-text">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Section 4: Drop-Off Locations ───────────────── */}
      <section className="bg-white py-20">
        <div className={cn(INNER, 'text-center')}>
          <h2 className="font-display text-[40px] text-brand-text md:text-[52px]">Drop-Off Locations</h2>
          <p className="mt-3 font-body text-brand-text/70">
            Find convenient donation bins across BU campus
          </p>

          <div className="mt-8 h-[400px] overflow-hidden rounded-xl">
            <DonationMapWrapper />
          </div>

          <p className="mt-6 font-body text-brand-text/70">
            Can&apos;t make it to a bin? Bring your clothes to a swap or donation drive near you.
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="dark" href="/events" className="rounded-full">
              Find Swap &amp; Drive Events
            </Button>
          </div>
        </div>
      </section>

      {/* ── Section 5: Schedule a Pickup ────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className={INNER}>
          <div className="text-center">
            <h2 className="font-display text-[40px] text-brand-text md:text-[52px]">Schedule a Pickup</h2>
            <p className="mt-3 font-body text-brand-text/70">
              Can&apos;t make it to a bin? Request a pickup and we&apos;ll coordinate a time.
            </p>
          </div>

          <Card className="mt-8 p-8">
            <PickupForm />
          </Card>
        </div>
      </section>

      {/* ── Section 6: Questions? ───────────────────────── */}
      <section className="bg-white py-20">
        <div className={cn(INNER, 'text-center')}>
          <h2 className="font-display text-[40px] text-brand-text md:text-[52px]">Questions?</h2>
          <p className="mt-3 font-body text-brand-text/70">
            We&apos;re here to help with any questions about donating to BU Campus Closet.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/faq" variant="olive">
              View FAQ Page
            </Button>
            <Button href="/contact" className="rounded-full bg-brand-tan text-white hover:opacity-90">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
