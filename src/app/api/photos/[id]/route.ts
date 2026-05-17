import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const photo = await prisma.galleryPhoto.findUnique({ where: { id } })
    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    return NextResponse.json({ data: photo })
  } catch {
    return NextResponse.json({ error: 'Failed to load photo' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  const body = await request.json()
  const { url, caption, eventId, displayOrder } = body

  try {
    const photo = await prisma.galleryPhoto.update({
      where: { id },
      data: { url, caption, eventId, displayOrder },
    })
    return NextResponse.json({ data: photo })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  try {
    const photo = await prisma.galleryPhoto.findUnique({ where: { id } })
    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

    await prisma.galleryPhoto.delete({ where: { id } })

    // Clean up the file in Supabase Storage
    if (photo.url) {
      await deleteStorageFile(photo.url)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}

async function deleteStorageFile(url: string) {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/`
  if (!url.startsWith(baseUrl)) return

  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const path = url.slice(baseUrl.length)
  await supabaseAdmin.storage.from('photos').remove([path])
}
