import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ data: members })
  } catch {
    return NextResponse.json({ error: 'Failed to load team members. Please try again.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const body = await request.json()
  const { name, role, bio, photoUrl, displayOrder } = body

  if (!name || !role) {
    return NextResponse.json({ error: 'name and role are required' }, { status: 400 })
  }

  try {
    const member = await prisma.teamMember.create({
      data: { name, role, bio, photoUrl, displayOrder: displayOrder ?? 0 },
    })
    return NextResponse.json({ data: member }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to add team member. Please try again.' }, { status: 500 })
  }
}
