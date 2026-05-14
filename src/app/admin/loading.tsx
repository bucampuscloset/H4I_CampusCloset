export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      {/* Content area */}
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
