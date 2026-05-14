import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ data: items })
  } catch {
    return NextResponse.json({ error: 'Failed to load FAQ items. Please try again.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const body = await request.json()
  const { question, answer, category, displayOrder } = body

  if (!question || !answer) {
    return NextResponse.json({ error: 'question and answer are required' }, { status: 400 })
  }

  try {
    const item = await prisma.faqItem.create({
      data: {
        question,
        answer,
        category: category ?? 'General',
        displayOrder: displayOrder ?? 0,
      },
    })
    return NextResponse.json({ data: item }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ item. Please try again.' }, { status: 500 })
  }
}
