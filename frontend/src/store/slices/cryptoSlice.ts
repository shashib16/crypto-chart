// store/slices/cryptoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Crypto {
  id: number
  name: string
  symbol: string
  price: number
  change: number
  type: string
  marketCap?: number
  volume24h?: number
  high24h?: number
  low24h?: number
}

interface CryptoState {
  cryptos: Crypto[]
  selectedCrypto: Crypto | null
  searchQuery: string
  searchResults: Crypto[]
  favorites: number[]
  isLoading: boolean
  error: string | null
  page: number
  totalPages: number
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock crypto data
const mockCryptoData: Crypto[] = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 43250, change: 2.5, type: 'crypto', marketCap: 846000000000, volume24h: 28000000000 },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2280, change: 3.2, type: 'crypto', marketCap: 274000000000, volume24h: 12000000000 },
  { id: 3, name: 'Binance Coin', symbol: 'BNB', price: 315, change: -1.2, type: 'crypto', marketCap: 47000000000, volume24h: 1200000000 },
  { id: 4, name: 'Solana', symbol: 'SOL', price: 98, change: 5.8, type: 'crypto', marketCap: 42000000000, volume24h: 2100000000 },
  { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.58, change: 1.9, type: 'crypto', marketCap: 20000000000, volume24h: 680000000 },
  { id: 6, name: 'XRP', symbol: 'XRP', price: 0.62, change: -0.8, type: 'crypto', marketCap: 33000000000, volume24h: 1100000000 },
  { id: 7, name: 'Polkadot', symbol: 'DOT', price: 7.45, change: 4.2, type: 'crypto', marketCap: 9500000000, volume24h: 420000000 },
  { id: 8, name: 'Dogecoin', symbol: 'DOGE', price: 0.095, change: 6.7, type: 'crypto', marketCap: 13500000000, volume24h: 890000000 },
  { id: 9, name: 'Avalanche', symbol: 'AVAX', price: 38.50, change: 3.5, type: 'crypto', marketCap: 14000000000, volume24h: 580000000 },
  { id: 10, name: 'Chainlink', symbol: 'LINK', price: 14.80, change: 2.1, type: 'crypto', marketCap: 8700000000, volume24h: 450000000 }
]

// Async thunks
export const fetchCryptoList = createAsyncThunk(
  'crypto/fetchList',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    // Simulate API call
    await delay(500)
    
    // In a real app, this would be an API call
    // const response = await fetch(`/api/cryptos?page=${page}&limit=${limit}`)
    // const data = await response.json()
    
    // Mock pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockCryptoData.slice(startIndex, endIndex)
    
    // Include Bitcoin data for default selection
    const bitcoin = mockCryptoData.find(crypto => crypto.symbol === 'BTC')
    
    return {
      cryptos: paginatedData,
      page,
      totalPages: Math.ceil(mockCryptoData.length / limit),
      defaultCrypto: bitcoin || paginatedData[0]
    }
  }
)

export const updateCryptoPrices = createAsyncThunk(
  'crypto/updatePrices',
  async (_, { getState }) => {
    const state = getState() as { crypto: CryptoState }
    const currentCryptos = state.crypto.cryptos
    
    // Simulate price updates
    const updatedCryptos = currentCryptos.map(crypto => {
      const priceChange = (Math.random() - 0.5) * 0.02 // ±2% max change
      const newPrice = crypto.price * (1 + priceChange)
      const changePercent = (Math.random() - 0.5) * 5 // ±5% daily change
      
      return {
        ...crypto,
        price: Number(newPrice.toFixed(crypto.price > 100 ? 2 : 4)),
        change: Number(changePercent.toFixed(2))
      }
    })
    
    await delay(100) // Simulate network delay
    return updatedCryptos
  }
)

const initialState: CryptoState = {
  cryptos: [],
  selectedCrypto: null,
  searchQuery: '',
  searchResults: [],
  favorites: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1
}

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      
      // Filter search results
      if (action.payload.length > 0) {
        state.searchResults = state.cryptos.filter(
          crypto => 
            crypto.name.toLowerCase().includes(action.payload.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(action.payload.toLowerCase())
        )
      } else {
        state.searchResults = []
      }
    },
    
    selectCrypto: (state, action: PayloadAction<Crypto>) => {
      state.selectedCrypto = action.payload
    },
    
    updateCryptoPrice: (state, action: PayloadAction<{ id: number; price: number; change: number }>) => {
      const { id, price, change } = action.payload
      const crypto = state.cryptos.find(c => c.id === id)
      if (crypto) {
        crypto.price = price
        crypto.change = change
      }
      
      // Update selected crypto if it's the one being updated
      if (state.selectedCrypto?.id === id) {
        state.selectedCrypto.price = price
        state.selectedCrypto.change = change
      }
    },
    
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload)
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload)
    },
    
    setCryptos: (state, action: PayloadAction<Crypto[]>) => {
      state.cryptos = action.payload
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch crypto list cases
      .addCase(fetchCryptoList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCryptoList.fulfilled, (state, action) => {
        state.isLoading = false
        state.cryptos = action.payload.cryptos
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        
        // Select Bitcoin by default if no crypto is selected
        if (!state.selectedCrypto) {
          state.selectedCrypto = action.payload.defaultCrypto
        }
      })
      .addCase(fetchCryptoList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch cryptocurrencies'
      })
      
      // Update prices cases
      .addCase(updateCryptoPrices.pending, (state) => {
        // Don't show loading for price updates
      })
      .addCase(updateCryptoPrices.fulfilled, (state, action) => {
        state.cryptos = action.payload
        
        // Update selected crypto if it exists
        if (state.selectedCrypto) {
          const updated = action.payload.find(c => c.id === state.selectedCrypto!.id)
          if (updated) {
            state.selectedCrypto = updated
          }
        }
        
        // Update search results if active
        if (state.searchQuery && state.searchResults.length > 0) {
          state.searchResults = state.searchResults.map(result => {
            const updated = action.payload.find(c => c.id === result.id)
            return updated || result
          })
        }
      })
      .addCase(updateCryptoPrices.rejected, (state, action) => {
        console.error('Failed to update prices:', action.error.message)
      })
  }
})

export const {
  setSearchQuery,
  selectCrypto,
  updateCryptoPrice,
  addToFavorites,
  removeFromFavorites,
  setCryptos,
  setPage
} = cryptoSlice.actions

export default cryptoSlice.reducer