import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'FAQ | Campus Closet',
  description:
    'Frequently asked questions about Campus Closet — how swaps work, what to donate, and how to get involved.',
}
import FaqList from '@/components/faq/FaqList'
import FaqContactForm from '@/components/faq/FaqContactForm'
import { getContentMap } from '@/lib/site-content'

export default async function FaqPage() {
  const content = await getContentMap({
    'faq.page_heading': 'Frequently Asked Questions',
    'faq.page_subtitle': "Have questions about how Campus Closet works? We've got answers.",
    'faq.still_heading': 'Still have questions?',
    'faq.still_body': "Can't find the answer you're looking for? Reach out to us directly.",
  })

  const items = await prisma.faqItem.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  }).catch(() => [])

  return (
    <>
      <section className="bg-brand-cream px-6 py-20 text-center md:px-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 font-display text-[48px] leading-[1.05] text-brand-text md:text-[64px]">
            {content['faq.page_heading']}
          </h1>
          <p className="mx-auto max-w-3xl font-body text-[16px] leading-[1.4] text-brand-text md:text-[20px] md:leading-[28px]">
            {content['faq.page_subtitle']}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 md:px-12">
        <FaqList items={items} />
      </section>

      <section className="bg-brand-olive px-6 py-20 md:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-4 font-display text-[40px] text-white md:text-[54px]">
            {content['faq.still_heading']}
          </h2>
          <p className="font-body text-[16px] leading-[1.4] text-white/90 md:text-[24px] md:leading-[24px]">
            {content['faq.still_body']}
          </p>
        </div>
        <FaqContactForm />
      </section>
    </>
  )
}
