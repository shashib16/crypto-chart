import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral',
  metricsKey?: 'totalMarketCap' | 'volume24h' | 'btcDominance' | 'activeCoins'

}


export default function MetricCard({ title, value, change, trend , metricsKey }: MetricCardProps) {

  const { metrics } = useAppSelector(state => state.dashboard)

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-500'
    if (trend === 'down') return 'text-red-600 dark:text-red-500'
    return 'text-gray-600 dark:text-gray-500'
  }

    const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4" />
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {Math.abs(change)}%
          </span>
        </div>
      </div>
    </div>
  )
}