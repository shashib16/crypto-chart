'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/SideBar'
import Header from '@/components/Header'
import MetricCard from '@/components/MetricCard'
import LiveChart from '@/components/LiveChart'
import PieChart from '@/components/PieChart'
import CryptoList from '@/components/CryptoList'
import SearchBar from '@/components/SearchBar'
import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchDashboardMetrics, updateMetric } from '@/store/slices/dashboardSlice'
import { fetchCryptoList, updateCryptoPrices } from '@/store/slices/cryptoSlice'
import { fetchChartData, updateLivePrice } from '@/store/slices/marketSlice'
import { initializeData, updatePrice } from '@/store/slices/chartSlice'
import { TrendingUp, Activity, DollarSign, Coins } from 'lucide-react'
import { fetchUserData } from '@/store/slices/userSlice'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.dashboard)
  const { selectedCrypto } = useAppSelector(state => state.crypto)
  const { metrics } = useAppSelector(state => state.dashboard)

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchDashboardMetrics())
    dispatch(fetchCryptoList({ page: 1 }))
    dispatch(fetchUserData())
  }, [dispatch])

  // Separate effect for selected crypto changes
  useEffect(() => {
    if (selectedCrypto) {
      dispatch(initializeData({ 
        timeframe: '1H', 
        basePrice: selectedCrypto.price 
      }))
    } else {
      dispatch(fetchChartData('1H'))
    }
  }, [selectedCrypto?.id, dispatch]) // Only depend on crypto id

  // Separate effect for real-time updates
  useEffect(() => {
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
    
    return () => {
      clearInterval(metricsInterval)
      clearInterval(priceInterval)
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
              value={metrics?.totalMarketCap || "$1.78T"}
              change={2.34}
              trend="up"
              icon={<DollarSign className="w-5 h-5" />}
              metricsKey="totalMarketCap"
            />
            <MetricCard
              title="24h Volume"
              value={metrics?.volume24h || "$98.3B"}
              change={-1.45}
              trend="down"
              icon={<Activity className="w-5 h-5" />}
              metricsKey="volume24h"
            />
            <MetricCard
              title="BTC Dominance"
              value={metrics?.btcDominance || "52.3%"}
              change={0.8}
              trend="up"
              icon={<TrendingUp className="w-5 h-5" />}
              metricsKey="btcDominance"
            />
            <MetricCard
              title="Active Coins"
              value={metrics?.activeCoins || "2,341"}
              change={3.2}
              trend="up"
              icon={<Coins className="w-5 h-5" />}
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