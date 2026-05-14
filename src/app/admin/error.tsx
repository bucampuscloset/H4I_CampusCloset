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
      <div className="h-16 w-16 rounded-full bg-brand-terra/10 flex items-center justify-center">
        <svg className="h-8 w-8 text-brand-terra" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="font-display text-[24px] text-brand-brown">Something went wrong</h2>
      <p className="max-w-md text-center font-body text-[14px] text-brand-text/60">
        {error.message || 'An unexpected error occurred. Please refresh the page or try again.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand-dark-olive px-6 py-2 font-heading font-bold text-white transition-colors hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
