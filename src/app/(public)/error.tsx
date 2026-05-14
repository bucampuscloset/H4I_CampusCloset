'use client'

import Button from '@/components/ui/Button'

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="font-display text-[28px] text-brand-brown">Something went wrong</h1>
      <p className="font-body text-[16px] text-brand-text/60">
        Something unexpected happened. Please refresh the page or try again later.
      </p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
