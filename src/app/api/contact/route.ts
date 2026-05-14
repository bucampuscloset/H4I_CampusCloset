import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

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
