'use client'

interface SidebarSkeletonProps {
  collapsed?: boolean
}

export function SidebarSkeleton({ collapsed = false }: SidebarSkeletonProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`h-16 border-b border-gray-700 flex items-center ${
        collapsed ? 'justify-center px-2' : 'justify-between px-6'
      }`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
          {!collapsed && (
            <div className="w-28 h-6 bg-gray-700 rounded animate-pulse" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center rounded-lg ${
                collapsed 
                  ? 'justify-center p-3' 
                  : 'gap-3 px-4 py-3'
              }`}
            >
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse flex-shrink-0" />
              {!collapsed && (
                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className={`border-t border-gray-700 ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-center rounded-lg ${
          collapsed ? 'justify-center p-2' : 'gap-3 p-3'
        }`}>
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse mb-1" />
              <div className="w-32 h-3 bg-gray-700 rounded animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}