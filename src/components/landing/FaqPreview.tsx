import { prisma } from '@/lib/prisma'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import { getContentMap } from '@/lib/site-content'

export default async function FaqPreview() {
  const content = await getContentMap({
    'landing.faq_heading': 'Frequently Asked Questions',
    'landing.faq_subtitle': 'Quick answers to the most common questions about Campus Closet.',
  })

  const items = await prisma.faqItem.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    take: 4,
  })

  if (items.length === 0) return null

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            {content['landing.faq_heading']}
          </h2>
          <p className="font-body text-[15px] text-brand-text/70">
            {content['landing.faq_subtitle']}
          </p>
        </div>

        <div className="mb-10">
          <Accordion items={items.map(({ question, answer }) => ({ question, answer }))} />
        </div>

        <div className="text-center">
          <Button variant="secondary" href="/faq">
            View Full FAQ
          </Button>
        </div>
      </div>
    </section>
  )
}
