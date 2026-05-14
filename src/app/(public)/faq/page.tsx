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

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  }).catch(() => [])

  return (
    <>
      <section className="bg-brand-cream px-6 pb-48 pt-16 text-center md:px-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 font-display text-[48px] leading-[1.05] text-brand-text md:text-[64px]">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-3xl font-body text-[16px] leading-[1.4] text-brand-text md:text-[20px] md:leading-[28px]">
            Have questions about how Campus Closet works? Find everything you need to
            know about swapping, donating, and our mission to reduce waste.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 md:px-12">
        <FaqList items={items} />
      </section>

      <section className="bg-brand-olive px-6 py-20 md:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-4 font-display text-[40px] text-white md:text-[54px]">
            Still have questions?
          </h2>
          <p className="font-body text-[16px] leading-[1.4] text-white/90 md:text-[24px] md:leading-[24px]">
            Can&apos;t find the answer you&apos;re looking for? Fill out the form below
            and our team will get back to you within 24 hours.
          </p>
        </div>
        <FaqContactForm />
      </section>
    </>
  )
}
