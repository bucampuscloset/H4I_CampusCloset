export default function FaqLoading() {
  return (
    <div className="min-h-screen bg-brand-cream px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Page heading */}
        <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
        {/* FAQ accordion items */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-4"
            >
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
