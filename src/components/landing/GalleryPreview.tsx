import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'

export default async function GalleryPreview() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  if (photos.length === 0) return null

  return (
    <section className="bg-brand-cream px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-[40px] text-brand-text md:text-[52px]">
            See Us in Action
          </h2>
          <p className="font-body text-[15px] text-brand-text/70">
            Snapshots from past swaps, drives, and community moments.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-md bg-gray-100"
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? 'Campus Closet event'}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="secondary" href="/about">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  )
}
