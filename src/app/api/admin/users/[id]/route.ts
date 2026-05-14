import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'

/** DELETE /api/admin/users/[id] — Remove an admin user */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const { id } = await params

    // Look up the target user
    const target = await prisma.adminUser.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json(
        { error: 'Admin user not found.' },
        { status: 404 },
      )
    }

    // Prevent self-deletion
    if (target.email === auth.user.email) {
      return NextResponse.json(
        { error: 'You cannot remove yourself as an admin.' },
        { status: 400 },
      )
    }

    await prisma.adminUser.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to remove admin user. Please try again.' },
      { status: 500 },
    )
  }
}
