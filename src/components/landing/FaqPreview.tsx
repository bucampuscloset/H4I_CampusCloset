import { prisma } from '@/lib/prisma'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'

export default async function FaqPreview() {
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
            Frequently Asked Questions
          </h2>
          <p className="font-body text-[15px] text-brand-text/70">
            Quick answers to the most common questions about Campus Closet.
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
