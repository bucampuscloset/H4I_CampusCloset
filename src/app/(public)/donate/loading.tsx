export default function DonateLoading() {
  return (
    <div className="min-h-screen bg-brand-cream px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Page heading */}
        <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
        {/* Description */}
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Donation bin cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-gray-100 bg-white p-5">
              <div className="h-36 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
