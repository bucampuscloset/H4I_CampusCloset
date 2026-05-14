import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { getContentMap } from '@/lib/site-content'

export default async function HowItWorks() {
  const content = await getContentMap({
    'landing.how_heading': 'How it Works',
    'landing.how_subtitle': 'Three Simple Steps to Sustainable Fashion!',
    'landing.step1_title': 'Donate',
    'landing.step1_desc': 'Bring clothes to donate!',
    'landing.step2_title': 'Swap & Discover',
    'landing.step2_desc': 'Explore curated racks and take what you love.',
    'landing.step3_title': 'Feel Good About It',
    'landing.step3_desc': 'Reduce waste and support a more sustainable campus.',
  })

  const steps = [
    {
      number: '1',
      title: content['landing.step1_title'],
      description: content['landing.step1_desc'],
      bg: 'bg-brand-dark-olive',
    },
    {
      number: '2',
      title: content['landing.step2_title'],
      description: content['landing.step2_desc'],
      bg: 'bg-brand-terra',
    },
    {
      number: '3',
      title: content['landing.step3_title'],
      description: content['landing.step3_desc'],
      bg: 'bg-brand-dark-olive',
    },
  ]

  return (
    <section className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-2 font-display text-[40px] text-brand-text md:text-[52px]">
          {content['landing.how_heading']}
        </h2>
        <p className="mb-14 font-body text-[15px] text-brand-text/70">
          {content['landing.how_subtitle']}
        </p>

        <div className="mb-12 grid gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div
                className={cn('mb-5 flex h-24 w-24 items-center justify-center rounded-full', step.bg)}
              >
                <span className="font-heading text-[38px] font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-2 font-body text-[26px] font-extrabold text-brand-text">
                {step.title}
              </h3>
              <p className="font-body text-[19px] leading-relaxed text-brand-text/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <Button variant="dark" href="/events">
          See Upcoming Events
        </Button>
      </div>
    </section>
  )
}
