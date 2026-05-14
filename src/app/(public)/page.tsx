import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Campus Closet — BU Clothing Swap',
  description:
    'A sustainability-focused clothing swap initiative at Boston University promoting circular fashion through free, recurring clothing swaps.',
}
import WhatIsCampusCloset from '@/components/landing/WhatIsCampusCloset'
import HowItWorks from '@/components/landing/HowItWorks'
import WhyItMatters from '@/components/landing/WhyItMatters'
import UpcomingEventsPreview from '@/components/landing/UpcomingEventsPreview'
import GetInvolved from '@/components/landing/GetInvolved'
import GalleryPreview from '@/components/landing/GalleryPreview'
import FaqPreview from '@/components/landing/FaqPreview'
import FooterCta from '@/components/landing/FooterCta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatIsCampusCloset />
      <HowItWorks />
      <WhyItMatters />
      <UpcomingEventsPreview />
      <GetInvolved />
      <GalleryPreview />
      <FaqPreview />
      <FooterCta />
    </>
  )
}
