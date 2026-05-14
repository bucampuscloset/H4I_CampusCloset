import type { Metadata } from 'next'
import EventsPageClient from './EventsPageClient'
import SwapVsDrive from '@/components/events/SwapVsDrive'
import PhotoGallery from '@/components/about/PhotoGallery'
import { getContentMap } from '@/lib/site-content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events | Campus Closet',
  description: 'Find upcoming Campus Closet clothing swaps, donation drives, and campus events.',
}

export default async function EventsPage() {
  const content = await getContentMap({
    'events.page_heading': 'Events',
    'events.page_subtitle': 'Find upcoming clothing swaps, donation drives, and more campus closet events!',
    'events.upcoming_heading': 'Upcoming Swaps and Drives',
    'events.upcoming_subtitle': 'Join us at our next clothing swap!',
    'events.no_events': 'No upcoming events - check back soon.',
  })

  return (
    <>
      <EventsPageClient content={content} />
      <SwapVsDrive />
      <PhotoGallery />
    </>
  )
}