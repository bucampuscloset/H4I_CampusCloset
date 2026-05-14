import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const CARD_COLORS = [
  'bg-brand-olive-light',
  'bg-brand-lavender-light',
  'bg-brand-tan-light',
]

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function UpcomingEventsPreview() {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 3,
  })

  if (events.length === 0) return null

  return (
    <section className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-[1178px] text-center">
        <h2 className="mb-2 font-display text-[40px] text-brand-text md:text-[52px]">
          Upcoming Events
        </h2>
        <p className="mb-12 font-body text-[15px] text-brand-text/70">
          Join us at our next clothing swap
        </p>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {events.map((event, i) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-[20px] bg-white text-left shadow-sm"
            >
              {/* Colored top section with calendar icon */}
              <div
                className={cn('flex h-56 items-center justify-center', CARD_COLORS[i % CARD_COLORS.length])}
              >
                <svg className="h-[72px] w-[72px] text-brand-text/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2a1 1 0 011 1v1h10V3a1 1 0 112 0v1h1a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm-2 8v10h16V10H4zm3 2h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                </svg>
              </div>

              {/* Card content */}
              <div className="p-6">
                <p className="mb-1 font-body text-[14px] font-extrabold text-brand-text">
                  {formatDate(event.date)}
                </p>
                <h3 className="mb-2 font-body text-[18px] font-extrabold text-brand-text md:text-[20px]">
                  {event.title}
                </h3>
                <p className="mb-3 font-body text-[14px] leading-relaxed text-brand-text/70 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-brand-text/60">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="font-body text-[14px]">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="dark" href="/events">
          View Full Calendar
        </Button>
      </div>
    </section>
  )
}
