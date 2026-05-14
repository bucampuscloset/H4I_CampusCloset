import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getContentMap } from '@/lib/site-content'

export default async function Hero() {
  const content = await getContentMap({
    'hero.badge': 'STUDENT-RUN INITIATIVE',
    'hero.subtitle': 'Swap, donate, and discover clothing while reducing fast fashion and building a better campus.',
  })


  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
          backgroundSize: '21px 21px',
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 text-center md:px-[104px] md:py-32">
        <div className="mb-8 flex justify-center">
          <Badge variant="outline">{content['hero.badge']}</Badge>
        </div>

        <h1 className="mx-auto max-w-4xl font-display text-[48px] leading-[1.05] text-brand-text md:text-[80px]">
          The community<br />
          <span className="font-display italic text-brand-olive">for sustainable</span><br />
          fashion at BU
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-[16px] leading-relaxed text-brand-text/70 md:text-[18px]">
          {content['hero.subtitle']}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="dark" href="/events">
            View Upcoming Events
          </Button>
          <Button variant="secondary" href="/donate">
            Donate Clothes{' '}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="ml-1 inline-block h-5 w-5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="relative h-9 w-full border-y-2 border-brand-brown bg-brand-olive-light" />
    </section>
  )
}
