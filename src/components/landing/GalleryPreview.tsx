import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'

export default async function GalleryPreview() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    take: 4,
  })

  if (photos.length === 0) return null

  return (
    <section className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            See Us in Action
          </h2>
          <p className="mx-auto max-w-2xl font-body text-[15px] text-brand-text/70">
            Campus Closet is a sustainability initiative on campus, aiming to promote sustainable
            fashion and circular consumption through free clothing swaps on campus.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-gray-100"
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? 'Campus Closet event'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="dark" href="/events#gallery">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  )
}
