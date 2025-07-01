'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/SideBar'
import Header from '@/components/Header'
import MetricCard from '@/components/MetricCard'
import LiveChart from '@/components/LiveChart'
import PieChart from '@/components/PieChart'
import CryptoList from '@/components/CryptoList'
import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton'
import { useAppDispatch, useAppSelector }  from '@/store/hooks'
import { fetchDashboardMetrics, updateMetric } from '@/store/slices/dashboardSlice'
import { fetchCryptoList, updateCryptoPrices } from '@/store/slices/cryptoSlice'
import { fetchChartData, updateLivePrice } from '@/store/slices/marketSlice'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.dashboard)

  

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchDashboardMetrics())
    dispatch(fetchCryptoList({ page: 1 }))
    dispatch(fetchChartData('1H'))
    
    // Simulate real-time updates
    const metricsInterval = setInterval(() => {
      // Random metric updates
      const metrics = ['totalMarketCap', 'volume24h', 'btcDominance', 'activeCoins'] as const
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]
      const randomChange = (Math.random() - 0.5) * 2
      
      dispatch(updateMetric({ metric: randomMetric, change: randomChange }))
    }, 5000)
    
    // Crypto price updates
    const priceInterval = setInterval(() => {
      dispatch(updateCryptoPrices())
    }, 3000)
    
    // Live chart updates
    const chartInterval = setInterval(() => {
      dispatch(updateLivePrice())
    }, 2000)
    
    return () => {
      clearInterval(metricsInterval)
      clearInterval(priceInterval)
      clearInterval(chartInterval)
    }
  }, [dispatch])

if (loading) {
    return <DashboardSkeleton />
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Total Market Cap"
              value="$1.78T"
              change={2.34}
              trend="up"
              metricsKey="totalMarketCap"
            />
            <MetricCard
              title="24h Volume"
              value="$98.3B"
              change={-1.45}
              trend="down"
              metricsKey="volume24h"
            />
            <MetricCard
              title="BTC Dominance"
              value="52.3%"
              change={0.8}
              trend="up"
              metricsKey="btcDominance"
            />
            <MetricCard
              title="Active Coins"
              value="2,341"
              change={3.2}
              trend="up"
              metricsKey="activeCoins"
            />
          </div>

          {/* Charts Section - Now with more space when sidebar is collapsed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LiveChart />
            <PieChart />
          </div>

          {/* Crypto List */}
          <CryptoList />
        </main>
      </div>
    </div>
  )
}