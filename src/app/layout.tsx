import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Campus Closet — BU Clothing Swap',
  description:
    'A sustainability-focused clothing swap initiative at Boston University.',
  openGraph: {
    title: 'Campus Closet — BU Clothing Swap',
    description: 'Swap, donate, and discover clothing while reducing fast fashion at BU.',
    siteName: 'Campus Closet',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Campus Closet — BU Clothing Swap' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Closet — BU Clothing Swap',
    description: 'Swap, donate, and discover clothing while reducing fast fashion at BU.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen flex flex-col bg-brand-cream text-brand-text">
        {children}
      </body>
    </html>
  )
}
