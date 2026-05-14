'use client'

import { useEffect, useState } from 'react'
import Badge from '@/components/ui/Badge'
import EventCalendar from '@/components/events/EventCalendar'
import EventCard from '@/components/events/EventCard'

interface Event {
  id: string
  title: string
  type: string
  date: Date
  location: string
  description: string
  itemLimit: number
}

type ApiEvent = Omit<Event, 'date'> & { date: string }

interface EventsPageClientProps {
  content: Record<string, string>
}

// Events page: calendar, swap/drive explainer, past event photos.
export default function EventsPageClient({ content }: EventsPageClientProps) {
  const [events, setEvents] = useState<Event[]>([])

  const upcomingEvents = events
    .filter((event) => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events')

        if (!res.ok) {
          setEvents([])
          return
        }

        const events = await res.json()

        if (!events || !events.data || !Array.isArray(events.data)) {
          setEvents([])
          return
        }

        const parsed: Event[] = events.data.map((e: ApiEvent) => ({
          ...e,
          date: new Date(e.date),
        }))
        setEvents(parsed)
      } catch {
        setEvents([])
      }
    }

    fetchEvents()
  }, [])

  return (
    <div>
      <div className="mx-6 my-10 md:m-[50px] text-center">
        <h1 className="font-display text-[48px] leading-[1.05] text-brand-text md:text-[64px]">{content['events.page_heading']}</h1>
        <p className="font-body text-[24px]">
          {content['events.page_subtitle']}
        </p>
        <Badge className="mx-auto mt-4 flex h-[66px] w-full max-w-[420px] items-center justify-center border-2 px-4 py-3 text-center text-[22px]">
          {events.filter((e) => e.type === 'swap' || e.type === 'drive').length}+ events hosted
        </Badge>
      </div>

      <div className="h-[50px] border-y-2 border-brand-brown bg-brand-olive-light" />

      <EventCalendar events={events} />

      <div className="mx-6 md:mx-[50px] mt-[30px]">
        <div className="mb-6 text-center">
          <h2 className="font-display text-[40px]">{content['events.upcoming_heading']}</h2>
          <p className="font-body text-brand-text/70">{content['events.upcoming_subtitle']}</p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <EventCard key={event.id} event={event} colorIndex={index} />
            ))}
          </div>
        ) : (
          <p className="mb-12 font-body text-brand-text/60">
            {content['events.no_events']}
          </p>
        )}
      </div>

    </div>
  )
}
