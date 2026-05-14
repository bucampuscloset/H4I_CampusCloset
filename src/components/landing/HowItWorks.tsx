import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const steps = [
  {
    number: '1',
    title: 'Donate',
    description: 'Bring clothes to donate!',
    bg: 'bg-brand-dark-olive',
  },
  {
    number: '2',
    title: 'Swap & Discover',
    description: 'Explore curated racks and take what you love.',
    bg: 'bg-brand-terra',
  },
  {
    number: '3',
    title: 'Feel Good About It',
    description: 'Reduce waste and support a more sustainable campus.',
    bg: 'bg-brand-dark-olive',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-2 font-display text-[40px] text-brand-text md:text-[52px]">
          How it Works
        </h2>
        <p className="mb-14 font-body text-[15px] text-brand-text/70">
          Three Simple Steps to Sustainable Fashion!
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
