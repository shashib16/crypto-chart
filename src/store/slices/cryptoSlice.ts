import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface CryptoItem {
  id: string
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  change7d: number
  marketCap: number
  volume: number
  sparkline: number[]
}

interface CryptoState {
  items: CryptoItem[]
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  totalCount: number
  filters: {
    search: string
    sortBy: 'rank' | 'price' | 'change24h' | 'marketCap'
    sortOrder: 'asc' | 'desc'
  }
}

const initialState: CryptoState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  totalCount: 0,
  filters: {
    search: '',
    sortBy: 'rank',
    sortOrder: 'asc',
  },
}

// Simulate fetching crypto data
export const fetchCryptoList = createAsyncThunk(
  'crypto/fetchList',
  async ({ page, limit = 20 }: { page: number; limit?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate mock data
    const mockCoins = [
      { name: 'Bitcoin', symbol: 'BTC', basePrice: 43000 },
      { name: 'Ethereum', symbol: 'ETH', basePrice: 2200 },
      { name: 'Binance Coin', symbol: 'BNB', basePrice: 300 },
      { name: 'XRP', symbol: 'XRP', basePrice: 0.6 },
      { name: 'Cardano', symbol: 'ADA', basePrice: 0.5 },
      { name: 'Solana', symbol: 'SOL', basePrice: 90 },
      { name: 'Polkadot', symbol: 'DOT', basePrice: 7 },
      { name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.08 },
    ]
    
    const items: CryptoItem[] = Array.from({ length: limit }, (_, i) => {
      const coin = mockCoins[i % mockCoins.length]
      const rankOffset = (page - 1) * limit
      const priceVariation = 1 + (Math.random() - 0.5) * 0.1
      
      return {
        id: `${coin.symbol}-${rankOffset + i + 1}`,
        rank: rankOffset + i + 1,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.basePrice * priceVariation,
        change24h: (Math.random() - 0.5) * 20,
        change7d: (Math.random() - 0.5) * 40,
        marketCap: coin.basePrice * priceVariation * (1000000000 / (i + 1)),
        volume: Math.random() * 10000000000 / (i + 1),
        sparkline: Array.from({ length: 7 }, () => Math.random() * 100)
      }
    })
    
    return {
      items,
      totalCount: 2341,
      hasMore: (page - 1) * limit + limit < 2341,
    }
  }
)

// Simulate real-time price updates
export const updateCryptoPrices = createAsyncThunk(
  'crypto/updatePrices',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Generate price updates for random coins
    const updates: { id: string; price: number; change24h: number }[] = []
    const updateCount = Math.floor(Math.random() * 5) + 1
    
    for (let i = 0; i < updateCount; i++) {
      updates.push({
        id: `BTC-${Math.floor(Math.random() * 20) + 1}`,
        price: 43000 + (Math.random() - 0.5) * 1000,
        change24h: (Math.random() - 0.5) * 5,
      })
    }
    
    return updates
  }
)

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.page = 1
      state.items = []
    },
    setSorting: (state, action: PayloadAction<{
      sortBy: CryptoState['filters']['sortBy']
      sortOrder: CryptoState['filters']['sortOrder']
    }>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.page = 1
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchCryptoList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoList.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.page === 1 
          ? action.payload.items 
          : [...state.items, ...action.payload.items]
        state.totalCount = action.payload.totalCount
        state.hasMore = action.payload.hasMore
        state.page += 1
      })
      .addCase(fetchCryptoList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch crypto list'
      })
      
      // Update prices
      .addCase(updateCryptoPrices.fulfilled, (state, action) => {
        action.payload.forEach(update => {
          const index = state.items.findIndex(item => item.id === update.id)
          if (index !== -1) {
            state.items[index].price = update.price
            state.items[index].change24h = update.change24h
          }
        })
      })
  },
})

export const { setSearch, setSorting, resetFilters } = cryptoSlice.actions
const cryptoReducer = cryptoSlice.reducer
export default cryptoReducer