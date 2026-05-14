import Button from '@/components/ui/Button'
import { RefreshCw, Leaf, Users } from 'lucide-react'
import { getContentMap } from '@/lib/site-content'

export default async function GetInvolved() {
  const content = await getContentMap({
    'landing.involved_heading': 'How Can You Get Involved?',
    'landing.involved_subtitle': 'Campus Closet is a sustainability initiative on campus, aiming to promote sustainable fashion and circular consumption through free clothing swaps on campus.',
    'landing.action1_title': 'Attend a Swap',
    'landing.action1_desc': 'Exchange clothes with fellow students at no cost, sustainable fashion made easy.',
    'landing.action2_title': 'Donate Clothes',
    'landing.action2_desc': 'Keep clothing out of landfills by donating and swapping items on campus.',
    'landing.action3_title': 'Join the Team',
    'landing.action3_desc': 'Built by students, for students—creating a sustainable campus together.',
  })

  const actions = [
    {
      title: content['landing.action1_title'],
      description: content['landing.action1_desc'],
      cta: 'See Events',
      href: '/events',
      icon: <RefreshCw className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
    },
    {
      title: content['landing.action2_title'],
      description: content['landing.action2_desc'],
      cta: 'Donate',
      href: '/donate',
      icon: <Leaf className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
    },
    {
      title: content['landing.action3_title'],
      description: content['landing.action3_desc'],
      cta: 'Get Involved',
      href: '/about',
      icon: <Users className="h-8 w-8 text-brand-text" strokeWidth={2.5} />,
    },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            {content['landing.involved_heading']}
          </h2>
          <p className="mx-auto max-w-2xl font-body text-[15px] text-brand-text/70">
            {content['landing.involved_subtitle']}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {actions.map((action) => (
            <div
              key={action.title}
              className="flex flex-col items-center rounded-2xl border-2 border-brand-text bg-white px-8 py-10 text-center"
            >
              <div className="mb-5 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gray-200">
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
