export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-brand-olive-light animate-pulse" />
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-3 pl-4 h-4 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-px bg-gradient-to-r from-brand-olive-light via-brand-cream to-transparent" />
      </div>
      {/* Content area */}
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}
