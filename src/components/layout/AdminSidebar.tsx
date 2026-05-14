'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Impact', href: '/admin/impact' },
  { label: 'Donation Bins', href: '/admin/bins' },
  { label: 'Contact Inbox', href: '/admin/contact' },
  { label: 'Team', href: '/admin/team' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Photos', href: '/admin/photos' },
  { label: 'Site Content', href: '/admin/content' },
  { label: 'Admin Users', href: '/admin/users' },
] as const

export default function AdminSidebar() {
  const pathname = usePathname()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <Link href="/admin" className="font-display text-[20px] text-brand-brown">
          CC Admin
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {ADMIN_LINKS.map((link) => {
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 font-body text-[14px] transition-colors',
                    isActive
                      ? 'bg-brand-olive-light font-bold text-brand-olive'
                      : 'text-brand-text/70 hover:bg-gray-100 hover:text-brand-text',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 px-3 py-4 flex flex-col gap-1">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 font-body text-[14px] text-brand-text/70 transition-colors hover:bg-gray-100 hover:text-brand-text"
        >
          ← View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg px-3 py-2 text-left font-body text-[14px] text-brand-terra transition-colors hover:bg-brand-terra/10"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
