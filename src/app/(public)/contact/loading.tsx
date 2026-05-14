export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-brand-cream px-6 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Page heading */}
        <div className="h-10 w-56 animate-pulse rounded bg-gray-200" />
        {/* Description */}
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        {/* Form fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-32 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
