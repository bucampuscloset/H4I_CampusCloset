'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { FAQ_CATEGORIES } from '@/types'
import type { FaqItem } from '@/types'
import FaqSearch from './FaqSearch'

interface FaqListProps {
  items: FaqItem[]
}

const CATEGORY_HEADINGS: Record<string, string> = {
  Participation: 'Participation & Rules',
  Donations: 'Donating Clothes',
  'Events & Logistics': 'Events & Logistics',
  Volunteering: 'Volunteering',
  General: 'General',
}

export default function FaqList({ items }: FaqListProps) {
  const [activeCategory, setActiveCategory] = useState<string>(FAQ_CATEGORIES[0])
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(items.map((i) => i.category)))
    return [...FAQ_CATEGORIES, ...fromData.filter((c) => !(FAQ_CATEGORIES as readonly string[]).includes(c))]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items
      .filter((item) => item.category === activeCategory)
      .filter((item) =>
        q.length === 0
          ? true
          : item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
      )
  }, [items, activeCategory, query])

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setOpenIndex(0)
  }

  const heading = CATEGORY_HEADINGS[activeCategory] ?? activeCategory

  return (
    <div>
      <div className="-mt-8 mb-16 md:-mt-12">
        <FaqSearch onSearch={setQuery} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[260px_1fr]">
        <aside>
          <div className="mb-3 h-px bg-gray-300" />
          <h3 className="mb-4 font-body text-[20px] font-extrabold text-brand-text md:text-[30px]">
            Categories
          </h3>
          <ul className="flex flex-row flex-wrap gap-1 md:flex-col md:gap-1">
            {categories.map((category) => {
              const isActive = category === activeCategory
              return (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-[10px] px-5 py-2.5 text-left font-body text-[16px] transition-colors md:text-[20px]',
                      isActive
                        ? 'border-l-[7px] border-brand-blue-light bg-brand-faq-active pl-4 font-medium text-brand-text'
                        : 'text-brand-text/70 hover:text-brand-text',
                    )}
                  >
                    {category}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div>
          <h2 className="mb-6 font-body text-[24px] font-extrabold text-brand-text md:text-[40px]">
            {heading}
          </h2>

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((item, i) => {
                const isOpen = openIndex === i
                const panelId = `faq-panel-${item.id}`
                const buttonId = `faq-btn-${item.id}`
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'overflow-hidden rounded-[15px] border border-gray-400',
                      isOpen ? 'bg-brand-faq-active' : 'bg-white',
                    )}
                  >
                    <button
                      id={buttonId}
                      type="button"
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="font-body text-[16px] font-extrabold text-brand-text md:text-[20px]">
                        {item.question}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          'ml-4 h-5 w-5 shrink-0 text-brand-text/50 transition-transform',
                          isOpen && 'rotate-180',
                        )}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="border-t border-gray-400 px-6 pb-5 pt-4"
                      >
                        <p className="font-body text-[15px] leading-relaxed text-brand-text md:text-[20px] md:leading-[32px]">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="font-body text-[14px] text-brand-text/60">
              {query
                ? `No questions matching "${query}" in this category.`
                : 'No questions in this category yet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
