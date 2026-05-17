import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

// GET — list all site content entries
export async function GET() {
  try {
    const entries = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json({ data: entries })
  } catch {
    return NextResponse.json({ error: 'Failed to load site content. Please refresh the page.' }, { status: 500 })
  }
}

// POST — create or update a site content entry (upsert by key)
export async function POST(request: Request) {
  try {
    const guard = await requireAdmin()
    if (guard.error) return guard.error

    const body = await request.json()
    const { key, value } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Content key is required.' }, { status: 400 })
    }
    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'Content value cannot be empty.' }, { status: 400 })
    }

    const entry = await prisma.siteContent.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })

    // Bust ISR cache so changes appear immediately on all public pages
    revalidatePath('/', 'layout')

    return NextResponse.json({ data: entry }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save content changes. Please try again.' }, { status: 500 })
  }
}
