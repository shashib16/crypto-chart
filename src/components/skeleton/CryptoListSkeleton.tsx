import { Skeleton } from "./Skeletons"

export function CryptoListItemSkeleton() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Rank */}
          <Skeleton className="h-5 w-8" />
          
          {/* Star and Name */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
        
        {/* Price and changes */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16 hidden md:block" />
          <Skeleton className="h-5 w-24 hidden lg:block" />
          <Skeleton className="h-5 w-20 hidden lg:block" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function CryptoListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
      
      {/* Table header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12 hidden md:block" />
            <Skeleton className="h-4 w-20 hidden lg:block" />
            <Skeleton className="h-4 w-16 hidden lg:block" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
      
      {/* List items */}
      {[...Array(10)].map((_, i) => (
        <CryptoListItemSkeleton key={i} />
      ))}
    </div>
  )
}