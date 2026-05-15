'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'

interface FaqSearchProps {
  onSearch: (query: string) => void
}

export default function FaqSearch({ onSearch }: FaqSearchProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <Card className="mx-auto w-full max-w-5xl px-8 py-8 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
      <h2 className="mb-5 text-center font-body text-[22px] font-extrabold text-brand-text md:text-[30px]">
        How can we help?
      </h2>
      <form onSubmit={handleSubmit} className="flex items-stretch gap-3">
        <div className="relative flex-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            aria-label="Search FAQs"
            placeholder="Search for questions..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              onSearch(e.target.value.trim())
            }}
            className="h-[52px] w-full rounded-[10px] border border-gray-400 bg-gray-50 pl-12 pr-4 font-body text-[16px] text-brand-text/60 placeholder:text-brand-text/40 focus:outline-none focus:ring-1 focus:ring-brand-olive md:h-[62px] md:text-[20px]"
          />
        </div>
        <button
          type="submit"
          className="h-[52px] rounded-[10px] bg-brand-blue px-6 font-body text-[16px] font-extrabold text-white transition-opacity hover:opacity-90 md:h-[62px] md:px-10 md:text-[24px]"
        >
          Search
        </button>
      </form>
    </Card>
  )
}
