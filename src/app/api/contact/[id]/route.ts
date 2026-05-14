import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

interface UpdateContactBody {
  status?: string
  name?: string
  email?: string
  message?: string
  type?: string
  preferredLocation?: string
  preferredDate?: string
  preferredTime?: string
}

// Admin only — update a contact request (e.g. status change)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAdmin()
    if (guard.error) return guard.error

    const { id } = await params
    const body = (await request.json()) as UpdateContactBody

    const validStatuses = ['new', 'responded', 'completed']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status. Must be one of: new, responded, or completed.' }, { status: 400 })
    }

    const updateData: {
      status?: string
      preferredDate?: Date
      preferredTime?: string
      preferredLocation?: string
    } = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.preferredDate !== undefined) updateData.preferredDate = new Date(body.preferredDate)
    if (body.preferredTime !== undefined) updateData.preferredTime = body.preferredTime
    if (body.preferredLocation !== undefined) updateData.preferredLocation = body.preferredLocation

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided. Please update at least one field.' }, { status: 400 })
    }

    const contactRequest = await prisma.contactRequest.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: contactRequest })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'This contact request no longer exists.' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update contact request. Please try again.' }, { status: 500 })
  }
}
