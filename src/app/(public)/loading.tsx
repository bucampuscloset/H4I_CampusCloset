export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-brand-cream px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Heading skeleton */}
        <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
        {/* Subtitle skeleton */}
        <div className="h-5 w-96 animate-pulse rounded bg-gray-200" />
        {/* Content blocks */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Secondary block */}
        <div className="h-48 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
