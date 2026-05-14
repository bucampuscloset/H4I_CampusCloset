import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/cn'
import { getContentMap } from '@/lib/site-content'

const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

export default async function TeamGrid() {
  const content = await getContentMap({
    'about.team_heading': 'Meet the E-Board',
    'about.team_subtitle': 'A dedicated team of students passionate about sustainability, fashion, and community.',
  })

  const members = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  }).catch(() => [])

  if (members.length === 0) {
    return (
      <section className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[54px]">
            {content['about.team_heading']}
          </h2>
          <p className="font-body text-[16px] text-brand-text/60">Team coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[54px]">
            {content['about.team_heading']}
          </h2>
          <p className="font-body text-[20px] leading-[28px] text-brand-text">
            {content['about.team_subtitle']}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {members.map((member, i) => (
            <div
              key={member.id}
              className={cn(
                'aspect-[4/5] overflow-hidden rounded-sm bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] transition-transform',
                ROTATIONS[i % ROTATIONS.length],
              )}
            >
              {member.photoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="font-body text-[13px] font-extrabold text-white">
                      {member.name}
                    </p>
                    <p className="font-body text-[11px] text-white/90">{member.role}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <p className="font-body text-[12px] text-brand-text/40">{member.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
