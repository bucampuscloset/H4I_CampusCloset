import { RefreshCw, Leaf, Users } from 'lucide-react'

const pillars = [
  {
    title: 'Free Clothing Swaps',
    description:
      'Exchange clothes with fellow students at no cost, sustainable fashion made easy.',
    cardBg: 'bg-brand-olive-light',
    iconBg: 'bg-brand-olive',
    icon: <RefreshCw className="h-10 w-10 text-white" strokeWidth={2.5} />,
  },
  {
    title: 'Sustainability First',
    description:
      'Keep clothing out of landfills by donating and swapping items on campus.',
    cardBg: 'bg-brand-lavender-light',
    iconBg: 'bg-brand-lavender',
    icon: <Leaf className="h-10 w-10 text-white" strokeWidth={2.5} />,
  },
  {
    title: 'Student-Run',
    description:
      'Built by students, for students—creating a sustainable campus together.',
    cardBg: 'bg-brand-blue-light',
    iconBg: 'bg-brand-blue',
    icon: <Users className="h-10 w-10 text-white" strokeWidth={2.5} />,
  },
]

export default function WhatIsCampusCloset() {
  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-[1382px]">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            What is Campus Closet?
          </h2>
          <p className="mx-auto max-w-2xl font-body text-[15px] text-brand-text/70">
            A student-run sustainability initiative at Boston University promoting
            circular fashion through free, recurring clothing swaps.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 md:gap-10">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`flex flex-col items-center justify-start rounded-[20px] ${pillar.cardBg} px-6 py-10 text-center md:px-8`}
            >
              <div
                className={`mb-5 flex h-16 w-16 md:h-[100px] md:w-[100px] shrink-0 items-center justify-center rounded-full ${pillar.iconBg}`}
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
