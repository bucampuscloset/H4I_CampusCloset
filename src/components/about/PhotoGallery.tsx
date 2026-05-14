import Image from 'next/image'
import { prisma } from '@/lib/prisma'

/* Bento grid placement for up to 7 photos:
   ┌──────┬────────────┬──────┐
   │  1   │     2      │  3   │  row 1
   │(tall)├────────────┴──────┤
   │      │        4          │  row 2
   ├──────┼────────────┬──────┤
   │  5   │     6      │  7   │  row 3
   │(tall)│            │      │
   └──────┴────────────┴──────┘  row 4
*/
const BENTO_CLASSES = [
  'col-start-1 row-start-1 row-span-2',         // 1: tall left
  'col-start-2 row-start-1',                     // 2: top center
  'col-start-3 row-start-1',                     // 3: top right
  'col-start-2 col-span-2 row-start-2',          // 4: wide center
  'col-start-1 row-start-3 row-span-2',          // 5: tall left
  'col-start-2 row-start-3 row-span-2',          // 6: bottom center
  'col-start-3 row-start-3 row-span-2',          // 7: bottom right
]

export default async function PhotoGallery() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    take: 7,
  }).catch(() => [])

  if (photos.length === 0) return null

  return (
    <section id="gallery" className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            Photos from Past Events
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3" style={{ gridTemplateRows: 'repeat(4, 160px)' }}>
          {photos.slice(0, 7).map((photo, i) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-[16px] bg-gray-100 ${BENTO_CLASSES[i] ?? ''}`}
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? 'Campus Closet event photo'}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
