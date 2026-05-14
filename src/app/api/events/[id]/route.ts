import { NextResponse } from 'next/server'
import { Prisma, EventType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

interface UpdateEventBody {
  title?: string
  type?: string
  location?: string
  description?: string
  itemLimit?: number
}

// GET (single), PUT (update), DELETE
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) { 
  try {
    const { id } = await params
    
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ data: event })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get event' }, { status: 500 })
  }
}

export async function PUT(request: Request,
  { params }: { params: Promise<{ id: string }> }) { 
    try {
        const authResult = await requireAdmin()
        if (authResult.error) {
            return authResult.error
        }

        const { id } = await params
        const body = (await request.json()) as UpdateEventBody

        const { title, type, location, description, itemLimit } = body

        const validTypes = ['swap', 'drive', 'meeting']
        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
          return NextResponse.json({ error: 'title must be a non-empty string' }, { status: 400 })
        }
        if (type !== undefined && (typeof type !== 'string' || !validTypes.includes(type))) {
          return NextResponse.json({ error: 'type must be one of: swap, drive, meeting' }, { status: 400 })
        }
        if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
          return NextResponse.json({ error: 'location must be a non-empty string' }, { status: 400 })
        }
        if (itemLimit !== undefined && (!Number.isInteger(itemLimit) || itemLimit < 0)) {
          return NextResponse.json({ error: 'itemLimit must be a non-negative integer' }, { status: 400 })
        }
        const event = await prisma.event.update({
            where: { id },
            data: { title, type: type as EventType | undefined, location, description, itemLimit },
        })

        return NextResponse.json({ data: event })

    } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const { id } = await params

    await prisma.event.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
