'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="font-display text-[24px] text-brand-brown">Something went wrong</h2>
      <p className="font-body text-[14px] text-brand-text/60">
        {error.message || 'An unexpected error occurred. Please refresh the page or try again.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand-dark-olive px-6 py-2 font-heading font-bold text-white hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
