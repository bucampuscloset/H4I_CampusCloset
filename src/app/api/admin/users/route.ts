import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'

/** GET /api/admin/users — List all admin users */
export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: users })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load admin users. Please try again.' },
      { status: 500 },
    )
  }
}

/** POST /api/admin/users — Add a new admin user by email */
export async function POST(req: Request) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await req.json()
    const email = (body.email ?? '').trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 },
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      )
    }

    // Check for duplicates
    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already an admin.' },
        { status: 409 },
      )
    }

    const user = await prisma.adminUser.create({
      data: { email },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to add admin user. Please try again.' },
      { status: 500 },
    )
  }
}
