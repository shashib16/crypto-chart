'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, Star, MoreVertical } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

interface CryptoItem {
  id: number
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  change7d: number
  marketCap: number
  volume: number
  isFavorite: boolean
}

export default function CryptoList() {
  const [cryptos, setCryptos] = useState<CryptoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  // Generate mock data
  const generateMockData = (pageNum: number): CryptoItem[] => {
    const baseCoins = [
      { name: 'Bitcoin', symbol: 'BTC', basePrice: 43000 },
      { name: 'Ethereum', symbol: 'ETH', basePrice: 2200 },
      { name: 'Binance Coin', symbol: 'BNB', basePrice: 300 },
      { name: 'XRP', symbol: 'XRP', basePrice: 0.6 },
      { name: 'Cardano', symbol: 'ADA', basePrice: 0.5 },
      { name: 'Solana', symbol: 'SOL', basePrice: 90 },
      { name: 'Polkadot', symbol: 'DOT', basePrice: 7 },
      { name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.08 },
      { name: 'Avalanche', symbol: 'AVAX', basePrice: 35 },
      { name: 'Chainlink', symbol: 'LINK', basePrice: 14 },
    ]

    return Array.from({ length: 10 }, (_, i) => {
      const coin = baseCoins[i % baseCoins.length]
      const priceVariation = 1 + (Math.random() - 0.5) * 0.1
      const price = coin.basePrice * priceVariation

      return {
        id: (pageNum - 1) * 10 + i + 1,
        rank: (pageNum - 1) * 10 + i + 1,
        name: coin.name,
        symbol: coin.symbol,
        price: price,
        change24h: (Math.random() - 0.5) * 20,
        change7d: (Math.random() - 0.5) * 40,
        marketCap: price * (1000000000 / (i + 1)),
        volume: (Math.random() * 10000000000) / (i + 1),
        isFavorite: Math.random() > 0.7
      }
    })
  }

  // Initial load
  useEffect(() => {
    setCryptos(generateMockData(1))
  }, [])

  // Load more function
  const loadMore = async () => {
    setLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newData = generateMockData(page + 1)
    setCryptos(prev => [...prev, ...newData])
    setPage(prev => prev + 1)
    setLoading(false)
  }

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.getElementById('crypto-list-container')
      if (scrollable) {
        const { scrollTop, scrollHeight, clientHeight } = scrollable
        if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
          loadMore()
        }
      }
    }

    const scrollable = document.getElementById('crypto-list-container')
    scrollable?.addEventListener('scroll', handleScroll)
    return () => scrollable?.removeEventListener('scroll', handleScroll)
  }, [loading, page])

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {/* Responsive Title */}
          <h2 className="text-base md:text-lg font-semibold">
            <span className="md:hidden">All Cryptos</span>
            <span className="hidden md:inline">All Cryptocurrencies</span>
          </h2>

          {/* Responsive Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-700 text-xs md:text-sm rounded-lg hover:bg-gray-600 transition-colors">
              <span className="hidden sm:inline">Export</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors">
              <span className="hidden sm:inline">Add New</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div id="crypto-list-container" className="overflow-auto max-h-[600px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="text-left p-4 font-medium text-gray-400">#</th>
              <th className="text-left p-4 font-medium text-gray-400">Name</th>
              <th className="text-right p-4 font-medium text-gray-400">Price</th>
              <th className="text-right p-4 font-medium text-gray-400">24h %</th>
              <th className="text-right p-4 font-medium text-gray-400 hidden md:table-cell">7d %</th>
              <th className="text-right p-4 font-medium text-gray-400 hidden lg:table-cell">Market Cap</th>
              <th className="text-right p-4 font-medium text-gray-400 hidden lg:table-cell">Volume(24h)</th>
              <th className="text-center p-4 font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr key={crypto.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                <td className="p-4 text-gray-400">{crypto.rank}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      className={`${crypto.isFavorite ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-500 transition-colors`}
                    >
                      <Star className="w-4 h-4" fill={crypto.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatNumber(crypto.price)}
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end gap-1 ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {crypto.change24h >= 0 ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{Math.abs(crypto.change24h).toFixed(2)}%</span>
                  </div>
                </td>
                <td className="p-4 text-right hidden md:table-cell">
                  <div className={`flex items-center justify-end gap-1 ${crypto.change7d >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {crypto.change7d >= 0 ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{Math.abs(crypto.change7d).toFixed(2)}%</span>
                  </div>
                </td>
                <td className="p-4 text-right text-gray-300 hidden lg:table-cell">
                  {formatNumber(crypto.marketCap)}
                </td>
                <td className="p-4 text-right text-gray-300 hidden lg:table-cell">
                  {formatNumber(crypto.volume)}
                </td>
                <td className="p-4 text-center">
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-8 text-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-2">Loading more cryptocurrencies...</p>
          </div>
        )}
      </div>
    </div>
  )
}