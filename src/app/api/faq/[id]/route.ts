import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const item = await prisma.faqItem.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'FAQ item not found' }, { status: 404 })
    return NextResponse.json({ data: item })
  } catch {
    return NextResponse.json({ error: 'Failed to load FAQ item' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  const body = await request.json()
  const { question, answer, category, displayOrder } = body

  try {
    const item = await prisma.faqItem.update({
      where: { id },
      data: { question, answer, category, displayOrder },
    })
    return NextResponse.json({ data: item })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'FAQ item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update FAQ item' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  try {
    await prisma.faqItem.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'FAQ item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete FAQ item' }, { status: 500 })
  }
}
