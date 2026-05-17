import type { Metadata } from 'next'
import { getContentMap } from '@/lib/site-content'
import ContactForm from './ContactForm'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact | Campus Closet',
  description:
    'Get in touch with Campus Closet — submit a general inquiry, request a pickup, or ask about dropping off donations.',
}

export default async function ContactPage() {
  const content = await getContentMap({
    'footer.email': 'campuscloset@bu.edu',
    'footer.instagram_url': 'https://www.instagram.com/bucampuscloset/',
    'footer.instagram_handle': '@bucampuscloset',
    'contact.heading': 'Get in Touch',
    'contact.subtitle': "Have a question, want to request a pickup, or just want to say hi? Fill out the form below and we'll get back to you within 24 hours.",
    'contact.info_heading': 'Other Ways to Reach Us',
  })
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-cream px-6 pb-16 pt-16 text-center md:px-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 font-display text-[48px] leading-[1.05] text-brand-text md:text-[64px]">
            {content['contact.heading']}
          </h1>
          <p className="mx-auto max-w-2xl font-body text-[16px] leading-[1.5] text-brand-text md:text-[20px] md:leading-[28px]">
            {content['contact.subtitle']}
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-brand-cream px-6 pb-20 md:px-12">
        <ContactForm />
      </section>

      {/* Contact info */}
      <section className="bg-white px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-display text-[40px] text-brand-text md:text-[52px]">
            {content['contact.info_heading']}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email card */}
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-brand-cream px-8 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-olive-light">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-olive" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="font-body text-[16px] font-extrabold text-brand-text">Email</p>
              <a
                href={`mailto:${content['footer.email']}`}
                className="font-body text-[15px] text-brand-olive underline-offset-2 hover:underline"
              >
                {content['footer.email']}
              </a>
            </div>

            {/* Instagram card */}
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-brand-cream px-8 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-lavender-light">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-lavender" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <p className="font-body text-[16px] font-extrabold text-brand-text">Instagram</p>
              <a
                href={content['footer.instagram_url']}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[15px] text-brand-lavender underline-offset-2 hover:underline"
              >
                {content['footer.instagram_handle']}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
