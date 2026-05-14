import { RefreshCw, Leaf, Users } from 'lucide-react'
import { getContentMap } from '@/lib/site-content'

export default async function WhatIsCampusCloset() {
  const content = await getContentMap({
    'landing.what_heading': 'What is Campus Closet?',
    'landing.what_subtitle': 'A student-run sustainability initiative at Boston University promoting circular fashion through free, recurring clothing swaps.',
    'landing.pillar1_title': 'Free Clothing Swaps',
    'landing.pillar1_desc': 'Exchange clothes with fellow students at no cost, sustainable fashion made easy.',
    'landing.pillar2_title': 'Sustainability First',
    'landing.pillar2_desc': 'Keep clothing out of landfills by donating and swapping items on campus.',
    'landing.pillar3_title': 'Student-Run',
    'landing.pillar3_desc': 'Built by students, for students—creating a sustainable campus together.',
  })

  const pillars = [
    {
      title: content['landing.pillar1_title'],
      description: content['landing.pillar1_desc'],
      cardBg: 'bg-brand-olive-light',
      iconBg: 'bg-brand-olive',
      icon: <RefreshCw className="h-10 w-10 text-white" strokeWidth={2.5} />,
    },
    {
      title: content['landing.pillar2_title'],
      description: content['landing.pillar2_desc'],
      cardBg: 'bg-brand-lavender-light',
      iconBg: 'bg-brand-lavender',
      icon: <Leaf className="h-10 w-10 text-white" strokeWidth={2.5} />,
    },
    {
      title: content['landing.pillar3_title'],
      description: content['landing.pillar3_desc'],
      cardBg: 'bg-brand-blue-light',
      iconBg: 'bg-brand-blue',
      icon: <Users className="h-10 w-10 text-white" strokeWidth={2.5} />,
    },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-[1382px]">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            {content['landing.what_heading']}
          </h2>
          <p className="mx-auto max-w-2xl font-body text-[15px] text-brand-text/70">
            {content['landing.what_subtitle']}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 md:gap-10">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`flex flex-col items-center justify-start rounded-[20px] ${pillar.cardBg} px-6 py-10 text-center md:px-8`}
            >
              <div
                className={`mb-5 flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full ${pillar.iconBg}`}
              >
                {pillar.icon}
              </div>
              <h3 className="mb-1 font-body text-[24px] font-extrabold text-brand-text md:text-[30px]">
                {pillar.title}
              </h3>
              <p className="font-body text-[16px] leading-relaxed text-brand-text md:text-[20px]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
