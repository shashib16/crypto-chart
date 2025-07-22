// components/MetricCard.tsx
'use client'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'

interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon?: React.ReactNode
  metricsKey: 'totalMarketCap' | 'volume24h' | 'btcDominance' | 'activeCoins'
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  metricsKey 
}: MetricCardProps) {
  const metrics = useAppSelector(state => state.dashboard.metrics)
  
  // Use dynamic value if available
  const displayValue = metrics?.[metricsKey] || value
  
  // Calculate dynamic change based on previous value
  const dynamicChange = metrics?.changes?.[metricsKey] || change
  const dynamicTrend = dynamicChange >= 0 ? 'up' : 'down'
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400">
          {icon || (
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          dynamicTrend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {dynamicTrend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{Math.abs(dynamicChange).toFixed(2)}%</span>
        </div>
      </div>
      
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{displayValue}</p>
      
      {/* Progress bar */}
      <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            dynamicTrend === 'up' ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(Math.abs(dynamicChange) * 10, 100)}%` }}
        />
      </div>
    </div>
  )
}