// components/CryptoList.tsx
'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Star, TrendingUp, TrendingDown } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectCrypto, addToFavorites, removeFromFavorites } from '@/store/slices/cryptoSlice'
import { setCrypto, initializeData } from '@/store/slices/chartSlice'

type SortField = 'rank' | 'name' | 'price' | 'change' | 'marketCap' | 'volume'
type SortOrder = 'asc' | 'desc'

export default function CryptoList() {
  const dispatch = useAppDispatch()
  const { cryptos, selectedCrypto, favorites } = useAppSelector(state => state.crypto)
  const { timeframe } = useAppSelector(state => state.chart)
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleSelectCrypto = (crypto: any) => {
    dispatch(selectCrypto(crypto))
    dispatch(setCrypto({
      id: crypto.id,
      symbol: crypto.symbol,
      price: crypto.price
    }))
    dispatch(initializeData({ 
      timeframe, 
      basePrice: crypto.price 
    }))
  }

  const toggleFavorite = (cryptoId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (favorites.includes(cryptoId)) {
      dispatch(removeFromFavorites(cryptoId))
    } else {
      dispatch(addToFavorites(cryptoId))
    }
  }

  const sortedCryptos = [...cryptos].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case 'rank':
        comparison = a.id - b.id
        break
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = a.price - b.price
        break
      case 'change':
        comparison = a.change - b.change
        break
      case 'marketCap':
        comparison = (a.marketCap || 0) - (b.marketCap || 0)
        break
      case 'volume':
        comparison = (a.volume24h || 0) - (b.volume24h || 0)
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Cryptocurrency Prices</h2>
        <p className="text-sm text-gray-400 mt-1">Click on any cryptocurrency to view its chart</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('rank')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  # <SortIcon field="rank" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  Name <SortIcon field="name" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 hover:text-white transition-colors ml-auto"
                >
                  Price <SortIcon field="price" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('change')}
                  className="flex items-center gap-1 hover:text-white transition-colors ml-auto"
                >
                  24h % <SortIcon field="change" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('marketCap')}
                  className="flex items-center gap-1 hover:text-white transition-colors ml-auto"
                >
                  Market Cap <SortIcon field="marketCap" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">
                <button 
                  onClick={() => handleSort('volume')}
                  className="flex items-center gap-1 hover:text-white transition-colors ml-auto"
                >
                  Volume (24h) <SortIcon field="volume" />
                </button>
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCryptos.map((crypto, index) => (
              <tr 
                key={crypto.id} 
                className={`border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                  selectedCrypto?.id === crypto.id ? 'bg-gray-700/30' : ''
                }`}
                onClick={() => handleSelectCrypto(crypto)}
              >
                <td className="p-4">
                  <span className="text-sm text-gray-400">{index + 1}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{crypto.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-xs text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <p className="font-medium">${crypto.price.toLocaleString()}</p>
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end gap-1 ${
                    crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {crypto.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <p className="text-sm">${(crypto.marketCap ? crypto.marketCap / 1e9 : 0).toFixed(2)}B</p>
                </td>
                <td className="p-4 text-right">
                  <p className="text-sm">${(crypto.volume24h ? crypto.volume24h / 1e9 : 0).toFixed(2)}B</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => toggleFavorite(crypto.id, e)}
                      className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                      title={favorites.includes(crypto.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(crypto.id)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {cryptos.length} of {cryptos.length} cryptocurrencies
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            2
          </button>
          <button className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}