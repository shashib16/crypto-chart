'use client'

import { useState } from 'react'
import { SidebarSkeleton } from './SidebarSkeleton'
import { HeaderSkeleton } from './HeaderSkeleton'
import { MetricCardsSkeleton } from './MetricCardSkeleton'
import { ChartSkeleton } from './ChartSkeleton'
import { CryptoListSkeleton } from './CryptoListSkeleton'

export function DashboardSkeleton() {
  const [sidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar Skeleton */}
      <SidebarSkeleton collapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Dashboard Content Skeleton */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Metric Cards Skeleton */}
          <div className="mb-6">
            <MetricCardsSkeleton />
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>

          {/* Crypto List Skeleton */}
          <CryptoListSkeleton />
        </main>
      </div>
    </div>
  )
}