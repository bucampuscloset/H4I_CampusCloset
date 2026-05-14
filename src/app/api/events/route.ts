import { NextResponse } from 'next/server'
import { EventType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

interface CreateEvent {
    title: string
    type: string
    date: string
    location: string
    description: string
    itemLimit: number
}

// GET (list/filter), POST (create)
export async function GET() { 
    try {
        const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ data: events })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }
}

export async function POST(request: Request) { 
    try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const body = (await request.json()) as CreateEvent

    const { title, type, date, location, description, itemLimit } = body

    if (typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'title must be a non-empty string' }, { status: 400 })
    }

    if (typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json({ error: 'type must be a non-empty string' }, { status: 400 })
    }

    if (typeof date !== 'string' || isNaN(Date.parse(date))) {
      return NextResponse.json({ error: 'date must be a valid ISO date string' }, { status: 400 })
    }

    if (typeof location !== 'string' || location.trim() === '') {
      return NextResponse.json({ error: 'location must be a non-empty string' }, { status: 400 })
    }

    if (typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json({ error: 'description must be a non-empty string' }, { status: 400 })
    }
    
    if (!Number.isInteger(itemLimit) || itemLimit < 0) {
      return NextResponse.json({ error: 'itemLimit must be a non-negative integer' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        type: type as EventType,
        date: new Date(date),
        location,
        description,
        itemLimit,
      },
    })

    return NextResponse.json({ data: event }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
