'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const DASHBOARD_ITEMS = [
  { label: 'Events', href: '/admin/events', desc: 'Manage upcoming and past events', color: 'border-l-brand-olive' },
  { label: 'Impact Data', href: '/admin/impact', desc: 'Log environmental impact stats', color: 'border-l-brand-blue' },
  { label: 'Donation Bins', href: '/admin/bins', desc: 'Manage bin locations on campus', color: 'border-l-brand-tan' },
  { label: 'Contact Inbox', href: '/admin/contact', desc: 'View and respond to messages', color: 'border-l-brand-lavender' },
  { label: 'Team Members', href: '/admin/team', desc: 'Edit team bios and photos', color: 'border-l-brand-olive' },
  { label: 'FAQ', href: '/admin/faq', desc: 'Add and edit FAQ entries', color: 'border-l-brand-blue' },
  { label: 'Photo Gallery', href: '/admin/photos', desc: 'Upload and manage photos', color: 'border-l-brand-tan' },
  { label: 'Site Content', href: '/admin/content', desc: 'Edit public-facing text and copy', color: 'border-l-brand-lavender' },
  { label: 'Admin Users', href: '/admin/users', desc: 'Manage admin access', color: 'border-l-brand-terra' },
  { label: 'Help', href: '/admin/help', desc: 'Documentation and guides', color: 'border-l-brand-blue' },
]

export default function AdminDashboardPage() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null)
    })
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle={email ? `Signed in as ${email}` : 'Welcome to Campus Closet Admin'}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`group relative overflow-hidden rounded-xl border border-gray-200 border-l-4 ${item.color} bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-brand-olive-light/20 transition-transform group-hover:scale-110" />
            <h2 className="relative font-heading text-[16px] font-bold text-brand-text">{item.label}</h2>
            <p className="relative mt-1 font-body text-[13px] text-brand-text/60">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
