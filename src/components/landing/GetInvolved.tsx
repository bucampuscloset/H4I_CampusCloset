import Button from '@/components/ui/Button'
import { RefreshCw, Leaf, Users } from 'lucide-react'

const actions = [
  {
    title: 'Attend a Swap',
    description:
      'Exchange clothes with fellow students at no cost, sustainable fashion made easy.',
    cta: 'See Events',
    href: '/events',
    icon: <RefreshCw className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
  },
  {
    title: 'Donate Clothes',
    description:
      'Keep clothing out of landfills by donating and swapping items on campus.',
    cta: 'Donate',
    href: '/donate',
    icon: <Leaf className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
  },
  {
    title: 'Join the Team',
    description:
      'Built by students, for students—creating a sustainable campus together.',
    cta: 'Get Involved',
    href: '/about',
    icon: <Users className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
  },
]

export default function GetInvolved() {
  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            How Can You Get Involved?
          </h2>
          <p className="mx-auto max-w-2xl font-body text-[15px] text-brand-text/70">
            Campus Closet is a sustainability initiative on campus, aiming to promote sustainable
            fashion and circular consumption through free clothing swaps on campus.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {actions.map((action) => (
            <div
              key={action.title}
              className="flex flex-col items-center rounded-2xl border-2 border-brand-text bg-white px-8 py-10 text-center"
            >
              <div className="mb-5 flex h-14 w-14 md:h-[80px] md:w-[80px] items-center justify-center rounded-full bg-gray-200">
                {action.icon}
              </div>
              <h3 className="mb-2 font-body text-[24px] font-extrabold text-brand-text">
                {action.title}
              </h3>
              <p className="mb-8 flex-1 font-body text-[16px] leading-relaxed text-brand-text/70">
                {action.description}
              </p>
              <Button variant="primary" href={action.href} fullWidth>
                {action.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
