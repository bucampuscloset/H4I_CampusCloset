import Image from 'next/image'
import { cn } from '@/lib/cn'
import { getContentMap } from '@/lib/site-content'

const PILLAR_ICONS = [
  { icon: '/icon-sustainability.png' },
  { icon: '/icon-community.png', iconClass: 'h-6 w-[42px]' },
  { icon: '/icon-accessibility.png' },
]

export default async function MissionSection() {
  const content = await getContentMap({
    'mission.label': '[ OUR MISSION ]',
    'mission.heading': 'REDUCING CONSUMPTION',
    'mission.tagline': 'Expanding Access.',
    'mission.body1': 'Campus Closet was founded on a simple belief: clothing should be shared, not wasted. As fast fashion fuels overconsumption and closets overflow, many students still struggle to access affordable options. We\u2019re working to break that cycle through free, circular clothing swaps that extend garment lifespans and reduce textile waste.',
    'mission.body2': 'By making contribution the currency instead of cash, we strengthen both community and environmental responsibility. Now as Campus Closet, we\u2019re expanding beyond Boston University to partner with other campuses and organizations, growing access to sustainable, free clothing wherever it\u2019s needed.',
    'mission.pillar1_title': 'Sustainability',
    'mission.pillar1_desc': 'Reducing textile waste on campus',
    'mission.pillar2_title': 'Community',
    'mission.pillar2_desc': 'Building connections through sharing',
    'mission.pillar3_title': 'Accessibility',
    'mission.pillar3_desc': 'Free clothing for all students',
  })

  const pillars = [
    { title: content['mission.pillar1_title'], description: content['mission.pillar1_desc'], ...PILLAR_ICONS[0] },
    { title: content['mission.pillar2_title'], description: content['mission.pillar2_desc'], ...PILLAR_ICONS[1] },
    { title: content['mission.pillar3_title'], description: content['mission.pillar3_desc'], ...PILLAR_ICONS[2] },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[6/5] overflow-hidden rounded-[20px]">
          <Image
            src="/mission.png"
            alt="Campus Closet community photo"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-4 font-body text-[13px] font-extrabold tracking-[0.2em] text-brand-text md:text-[20px] md:tracking-[4px]">
            {content['mission.label']}
          </p>
          <h2 className="mb-2 font-body text-[32px] font-extrabold leading-tight tracking-[-0.05em] text-brand-text md:text-[43px] md:tracking-[-2.4px]">
            {content['mission.heading']}
          </h2>
          <p className="mb-6 font-display text-[30px] italic text-brand-text md:text-[48px]">
            {content['mission.tagline']}
          </p>
          <p className="mb-6 font-body text-[16px] leading-[1.55] tracking-[0.18px] text-brand-text md:text-[18px] md:leading-[23px]">
            {content['mission.body1']}
          </p>
          <p className="mb-10 font-body text-[16px] leading-[1.55] tracking-[0.18px] text-brand-text md:text-[18px] md:leading-[23px]">
            {content['mission.body2']}
          </p>

          <div className="flex gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex gap-3">
                <div className="mt-1 h-24 w-[3px] shrink-0 rounded-full bg-gray-300" />
                <div>
                  <Image src={pillar.icon} alt="" width={24} height={24} className={cn('mb-1 h-6', pillar.iconClass ?? 'w-6')} aria-hidden="true" unoptimized />
                  <h3 className="mb-1 font-body text-[14px] font-extrabold tracking-[0.2px] text-brand-text md:text-[20px]">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-[12px] leading-[1.4] text-brand-text/70">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
