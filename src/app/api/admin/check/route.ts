import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

/** GET /api/admin/check — Check if the current session user is an admin */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'You must be signed in to access this page.' }, { status: 401 })
    }

    const admin = await prisma.adminUser.findUnique({ where: { email: user.email } })
    if (!admin) {
      return NextResponse.json({ error: 'You do not have admin access. Contact an administrator if you need access.' }, { status: 403 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to verify admin access. Please try signing in again.' }, { status: 500 })
  }
}
