import { Skeleton } from "./Skeletons"

export function MetricCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-4 w-24 mb-2" />
      <div className="flex items-end justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
}

// Usage: Show 4 skeleton cards
export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  )
}