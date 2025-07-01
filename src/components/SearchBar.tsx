'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, Clock, Star } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock search data
  const mockSearchData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 43250, change: 2.5, type: 'crypto' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2280, change: 3.2, type: 'crypto' },
    { id: 3, name: 'Binance Coin', symbol: 'BNB', price: 315, change: -1.2, type: 'crypto' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 98, change: 5.8, type: 'crypto' },
    { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.58, change: 1.9, type: 'crypto' },
  ]

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSearchData.filter(
        item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.symbol.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coins, markets, or news..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-1">Cryptocurrencies</p>
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setQuery(result.name)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{result.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-xs text-gray-400">{result.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${result.price.toLocaleString()}</p>
                      <p className={`text-xs ${result.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {result.change >= 0 ? '+' : ''}{result.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="border-t border-gray-700 p-2">
                <p className="text-xs text-gray-500 px-3 py-1">Quick Actions</p>
                <div className="flex gap-2 px-3">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                    <Clock className="w-4 h-4" />
                    Recent
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                    <Star className="w-4 h-4" />
                    Favorites
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}