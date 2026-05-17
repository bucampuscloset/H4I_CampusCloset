import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    return NextResponse.json({ data: member })
  } catch {
    return NextResponse.json({ error: 'Failed to load team member' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  const body = await request.json()
  const { name, role, bio, photoUrl, displayOrder } = body

  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: { name, role, bio, photoUrl, displayOrder },
    })
    return NextResponse.json({ data: member })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const { id } = await params
  try {
    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) return NextResponse.json({ error: 'Team member not found' }, { status: 404 })

    await prisma.teamMember.delete({ where: { id } })

    // Clean up the photo in Supabase Storage
    if (member.photoUrl) {
      await deleteStorageFile(member.photoUrl)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
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
