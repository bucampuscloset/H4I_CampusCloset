import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { rateLimit } from '@/lib/rate-limit'

interface CreateContactBody {
  name: string
  email: string
  message: string
  type?: string
  preferredLocation?: string
  preferredDate?: string
  preferredTime?: string
}

// Admin only — list all contact requests
export async function GET() {
  try {
    const guard = await requireAdmin()
    if (guard.error) return guard.error

    const requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: requests })
  } catch {
    return NextResponse.json({ error: 'Failed to load contact requests. Please refresh the page.' }, { status: 500 })
  }
}

// Public — submit a contact/pickup/dropoff request
export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per minute per IP
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const { success, retryAfter } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!success) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${retryAfter} seconds.` },
        { status: 429 },
      )
    }

    const body = (await request.json()) as CreateContactBody
    const { name, email, message, type, preferredLocation, preferredDate, preferredTime } = body

    const nameTrim = name?.trim()
    const emailTrim = email?.trim()
    const messageTrim = message?.trim()

    if (!nameTrim || !emailTrim || !messageTrim) {
      return NextResponse.json({ error: 'Please fill in your name, email, and message before submitting.' }, { status: 400 })
    }

    const validTypes = ['general', 'pickup', 'dropoff']
    const resolvedType = type && validTypes.includes(type) ? type : 'general'

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: nameTrim,
        email: emailTrim,
        message: messageTrim,
        type: resolvedType,
        preferredLocation: preferredLocation?.trim() ?? null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime?.trim() ?? null,
      },
    })

    return NextResponse.json({ data: contactRequest }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to send your message. Please try again later.' }, { status: 500 })
  }
}
