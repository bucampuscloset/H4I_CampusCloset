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
    await prisma.galleryPhoto.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
