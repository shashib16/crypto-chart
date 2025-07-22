'use client'

import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, TrendingUp, Clock, Star } from 'lucide-react'
import { 
  setSearchQuery, 
  selectCrypto,
  addToFavorites,
  removeFromFavorites 
} from '../store/slices/cryptoSlice'
import { setTimeframe } from '../store/slices/chartSlice'
import type { RootState, AppDispatch } from '../store/store'

export default function SearchBar() {
  const dispatch = useDispatch<AppDispatch>()
  const { searchQuery, searchResults, cryptos, favorites, selectedCrypto } = useSelector((state: RootState) => state.crypto)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get trending cryptos (top gainers)
  const trendingCryptos = [...cryptos]
    .sort((a, b) => b.change - a.change)
    .slice(0, 3)

  // Get recent cryptos (you might want to add a lastViewed timestamp to track this)
  const recentCryptos = cryptos.slice(0, 3)

  // Get favorite cryptos
  const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.id))

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchQuery])

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

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        input?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectCrypto = (crypto: any) => {
    dispatch(selectCrypto(crypto))
    dispatch(setSearchQuery(''))
    setIsOpen(false)
  }

  const toggleFavorite = (cryptoId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (favorites.includes(cryptoId)) {
      dispatch(removeFromFavorites(cryptoId))
    } else {
      dispatch(addToFavorites(cryptoId))
    }
  }

  const showQuickAction = (action: 'trending' | 'recent' | 'favorites') => {
    let results = []
    switch (action) {
      case 'trending':
        results = trendingCryptos
        break
      case 'recent':
        results = recentCryptos
        break
      case 'favorites':
        results = favoriteCryptos
        break
    }
    dispatch(setSearchQuery(' ')) // Set a space to keep dropdown open
    // Manually set search results
    if (results.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search coins"
          className=" tiwari w-full pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 overflow-hidden max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-1">Cryptocurrencies</p>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ${
                      selectedCrypto?.id === result.id ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleSelectCrypto(result)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{result.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-xs text-gray-400">{result.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleFavorite(result.id, e)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(result.id)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                      <div className="text-right">
                        <p className="font-medium">${result.price.toLocaleString()}</p>
                        <p className={`text-xs ${result.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {result.change >= 0 ? '+' : ''}{result.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : searchQuery.trim() === '' ? (
            <>
              {/* Show quick actions when search is empty but dropdown is open */}
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-1">Quick Actions</p>
                <div className="space-y-2">
                  {/* Trending */}
                  <div className="px-3">
                    <button
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
                      onClick={() => showQuickAction('trending')}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Trending
                    </button>
                    {trendingCryptos.map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ml-6"
                        onClick={() => handleSelectCrypto(crypto)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{crypto.name}</span>
                          <span className="text-xs text-gray-500">{crypto.symbol}</span>
                        </div>
                        <span className="text-sm text-green-500">+{crypto.change}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Favorites */}
                  {favoriteCryptos.length > 0 && (
                    <div className="px-3 pt-2 border-t border-gray-700">
                      <button
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
                        onClick={() => showQuickAction('favorites')}
                      >
                        <Star className="w-4 h-4" />
                        Favorites
                      </button>
                      {favoriteCryptos.map((crypto) => (
                        <div
                          key={crypto.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ml-6"
                          onClick={() => handleSelectCrypto(crypto)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{crypto.name}</span>
                            <span className="text-xs text-gray-500">{crypto.symbol}</span>
                          </div>
                          <span className={`text-sm ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}