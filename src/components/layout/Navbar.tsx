'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/cn'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-[1000] border-b-2 border-black bg-white" aria-label="Main navigation">
      <div className="mx-auto flex h-[83px] max-w-[1440px] items-center justify-between px-6 lg:px-[104px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Campus Closet logo"
            width={80}
            height={80}
            className="h-20 w-20 object-cover"
            priority
          />
          <span className="font-display text-[36px] leading-none text-brand-text">
            Campus Closet
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-[35px] font-body text-[24px] text-brand-text md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'transition-opacity hover:opacity-70',
                  isActive && 'font-bold underline underline-offset-4',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={cn('block h-0.5 w-6 bg-brand-text transition-transform', mobileOpen && 'translate-y-2 rotate-45')} />
          <span className={cn('block h-0.5 w-6 bg-brand-text transition-opacity', mobileOpen && 'opacity-0')} />
          <span className={cn('block h-0.5 w-6 bg-brand-text transition-transform', mobileOpen && '-translate-y-2 -rotate-45')} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-black bg-white px-6 pb-6 md:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block py-3 font-body text-[20px] text-brand-text',
                  isActive && 'font-bold',
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
