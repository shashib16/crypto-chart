export function HeaderSkeleton() {
  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between flex-shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="w-full h-10 bg-gray-700 rounded-lg animate-pulse" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Theme Toggle */}
        <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
        
        {/* Notifications */}
        <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="text-right">
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse mb-1" />
            <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  )
}