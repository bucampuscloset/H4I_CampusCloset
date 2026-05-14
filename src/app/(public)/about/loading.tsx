export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-brand-cream px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Page heading */}
        <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
        {/* Mission text */}
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Team members grid */}
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3 rounded-xl bg-white p-5">
              <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
