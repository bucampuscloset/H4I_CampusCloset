import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/cn'

const KG_TO_LBS = 2.20462

function fmt(n: number) {
  return n >= 1000 ? `${(Math.floor(n / 100) * 100).toLocaleString()}+` : `${n}+`
}

export default async function WhyItMatters() {
  const [agg, swapCount] = await Promise.all([
    prisma.impactStats.aggregate({
      _sum: { itemsReused: true, attendance: true, wasteDivertedKg: true, waterSavedL: true, carbonSavedKg: true },
    }).catch(() => ({ _sum: { itemsReused: 0, attendance: 0, wasteDivertedKg: 0, waterSavedL: 0, carbonSavedKg: 0 } })),
    prisma.event.count({ where: { type: 'swap' } }).catch(() => 0),
  ])

  const items = agg._sum.itemsReused ?? 0
  const attendance = agg._sum.attendance ?? 0
  const wasteLbs = Math.round((agg._sum.wasteDivertedKg ?? 0) * KG_TO_LBS)
  const hasStats = items > 0 || attendance > 0 || wasteLbs > 0 || swapCount > 0

  const stats = [
    { value: fmt(items), label: 'Clothing Items Swapped', color: 'text-brand-dark-olive', bg: 'bg-brand-stat-green' },
    { value: fmt(attendance), label: 'Students participated', color: 'text-brand-terra', bg: 'bg-brand-stat-terra' },
    { value: `${swapCount}+`, label: 'Swap Events Hosted', color: 'text-brand-brown-light', bg: 'bg-brand-stat-tan' },
    { value: `${wasteLbs} lbs`, label: 'Waste Diverted', color: 'text-brand-lavender', bg: 'bg-brand-lavender-light' },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-[40px] text-brand-text md:text-[52px]">
            Why it Matters?
          </h2>
          <p className="mb-8 font-body text-[15px] leading-relaxed text-brand-text/70 md:text-[18px]">
            The fashion industry is one of the world&apos;s most polluting
            industries. Clothing swaps help BU students extend the life of
            garments, reduce waste, and make sustainable fashion more
            accessible on campus.
          </p>

          {hasStats ? (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={cn('rounded-[15px] px-6 py-6', stat.bg)}
                >
                  <p className={cn('font-body text-[28px] font-extrabold leading-tight md:text-[36px]', stat.color)}>
                    {stat.value}
                  </p>
                  <p className="font-body text-[14px] text-brand-text md:text-[16px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-[14px] text-brand-text/50">Stats coming soon.</p>
          )}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src="/mission.png"
            alt="Campus Closet clothing swap event"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
