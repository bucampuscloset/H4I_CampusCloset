import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/cn'

const KG_TO_LBS = 2.20462
const LBS_PER_SUITCASE = 40
const LITERS_PER_PERSON_PER_YEAR = 1000
const LBS_CO2_PER_TREE_PER_YEAR = 48

function fmt(n: number, unit?: string) {
  const rounded = n >= 1000 ? `${(Math.floor(n / 100) * 100).toLocaleString()}+` : `${n}+`
  return unit ? `${rounded} ${unit}` : rounded
}

function roundToTwoSigFigs(num: number) {
  return num <= 0 ? 0 : Math.max(1, Number(num.toPrecision(2)))
}

export default async function AboutImpactStats() {
  const [agg, swapCount] = await Promise.all([
    prisma.impactStats.aggregate({
      _sum: { itemsReused: true, itemsDonated: true, attendance: true, wasteDivertedKg: true, waterSavedL: true, carbonSavedKg: true },
    }).catch(() => ({ _sum: { itemsReused: 0, itemsDonated: 0, attendance: 0, wasteDivertedKg: 0, waterSavedL: 0, carbonSavedKg: 0 } })),
    prisma.event.count({ where: { type: 'swap' } }).catch(() => 0),
  ])

  const items = agg._sum.itemsReused ?? 0
  const attendance = agg._sum.attendance ?? 0
  const wasteLbs = Math.round((agg._sum.wasteDivertedKg ?? 0) * KG_TO_LBS)
  const carbonLbs = Math.round((agg._sum.carbonSavedKg ?? 0) * KG_TO_LBS)
  const waterSavedL = Math.round(agg._sum.waterSavedL ?? 0)

  const suitcases = roundToTwoSigFigs(wasteLbs / LBS_PER_SUITCASE)
  const waterYears = roundToTwoSigFigs(waterSavedL / LITERS_PER_PERSON_PER_YEAR)
  const trees = roundToTwoSigFigs(carbonLbs / LBS_CO2_PER_TREE_PER_YEAR)

  const cards = [
    { value: fmt(items), label: 'Clothing Items Swapped', bgClass: 'bg-brand-stat-green', colorClass: 'text-brand-dark-olive' },
    { value: `${swapCount}+`, label: 'Swap Events Hosted', bgClass: 'bg-brand-stat-tan', colorClass: 'text-brand-brown-light' },
    { value: `${wasteLbs.toLocaleString()} lbs`, label: 'Waste Diverted', bgClass: 'bg-brand-stat-green', colorClass: 'text-brand-dark-olive' },
    { value: fmt(attendance), label: 'Students Participated', bgClass: 'bg-brand-stat-terra', colorClass: 'text-brand-terra' },
    { value: `${carbonLbs.toLocaleString()} lbs`, label: 'Carbon Saved', bgClass: 'bg-brand-stat-green', colorClass: 'text-brand-dark-olive' },
    { value: `${waterSavedL.toLocaleString()} liters`, label: 'Water Saved', bgClass: 'bg-brand-faq-active', colorClass: 'text-brand-blue' },
  ]

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn('overflow-hidden rounded-[15px] border-2 border-brand-text px-6 py-6', card.bgClass)}
          >
            <p className={cn('mb-1 font-body text-[28px] font-extrabold leading-[40px] md:text-[36px]', card.colorClass)}>
              {card.value}
            </p>
            <p className="font-body text-[14px] text-brand-text md:text-[16px]">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Equivalency stats — botanical annotations */}
      <div className="mt-12 flex flex-col items-start gap-8 md:flex-row md:justify-center md:gap-16">
        {/* Suitcases / waste */}
        <div className="flex items-start gap-4">
          <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" stroke="#3F604D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 44V24" />
            <path d="M24 24c0-12 12-18 12-18s-2 10-12 18" />
            <path d="M24 28c0-10-10-16-10-16s1 8 10 16" />
            <path d="M18 44h12" />
          </svg>
          <div>
            <p className="font-body text-[22px] font-extrabold text-brand-dark-olive">
              {suitcases.toLocaleString()}+ suitcases
            </p>
            <p className="font-body text-[12px] text-brand-text/45">
              of clothing kept out of landfills
            </p>
          </div>
        </div>

        {/* Water */}
        <div className="flex items-start gap-4">
          <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" stroke="#7B8CAB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 6s-10 14-10 22a10 10 0 0020 0C34 20 24 6 24 6z" />
            <path d="M20 32c0-4 4-8 4-8" />
          </svg>
          <div>
            <p className="font-body text-[22px] font-extrabold text-brand-dark-olive">
              {waterYears.toLocaleString()}+ people
            </p>
            <p className="font-body text-[12px] text-brand-text/45">
              sustained with water for a year
            </p>
          </div>
        </div>

        {/* Trees / carbon */}
        <div className="flex items-start gap-4">
          <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" stroke="#3F604D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="20" r="10" />
            <path d="M24 30v12" />
            <path d="M18 38h12" />
            <path d="M20 14c2 2 6 2 8 0" />
            <path d="M18 20c3 3 9 3 12 0" />
          </svg>
          <div>
            <p className="font-body text-[22px] font-extrabold text-brand-dark-olive">
              {trees.toLocaleString()}+ trees
            </p>
            <p className="font-body text-[12px] text-brand-text/45">
              worth of carbon absorbed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
