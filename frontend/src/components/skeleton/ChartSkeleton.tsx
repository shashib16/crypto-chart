import { Skeleton } from "./Skeletons";

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      
      {/* Timeframe buttons */}
      <div className="flex gap-1 mb-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-12" />
        ))}
      </div>
      
      {/* Chart area */}
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
}