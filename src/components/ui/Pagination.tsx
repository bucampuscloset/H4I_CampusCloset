'use client'

import { cn } from '@/lib/cn'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems: number
  pageSize: number
}

export default function Pagination({ page, pageCount, onPageChange, totalItems, pageSize }: PaginationProps) {
  if (pageCount <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="font-body text-[12px] text-brand-text/50">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'rounded-md px-3 py-1.5 font-heading text-[12px] font-semibold transition-colors',
            page <= 1
              ? 'text-brand-text/20 cursor-not-allowed'
              : 'text-brand-text/60 hover:bg-gray-100 hover:text-brand-text',
          )}
        >
          Prev
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'rounded-md px-3 py-1.5 font-heading text-[12px] font-semibold transition-colors',
              p === page
                ? 'bg-brand-olive text-white'
                : 'text-brand-text/60 hover:bg-gray-100 hover:text-brand-text',
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className={cn(
            'rounded-md px-3 py-1.5 font-heading text-[12px] font-semibold transition-colors',
            page >= pageCount
              ? 'text-brand-text/20 cursor-not-allowed'
              : 'text-brand-text/60 hover:bg-gray-100 hover:text-brand-text',
          )}
        >
          Next
        </button>
      </div>
    </div>
  )
}

/** Helper to paginate an array client-side. */
export function paginate<T>(items: T[], page: number, pageSize: number): { paged: T[]; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const clamped = Math.min(Math.max(1, page), pageCount)
  const paged = items.slice((clamped - 1) * pageSize, clamped * pageSize)
  return { paged, pageCount }
}
