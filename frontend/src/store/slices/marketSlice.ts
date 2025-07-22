// store/slices/marketSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type TimeFrame = '1M' | '5M' | '15M' | '1H' | '4H' | '1D'

interface ChartDataPoint {
  time: string
  price: number
  volume?: number
}

interface MarketState {
  chartData: ChartDataPoint[]
  currentPrice: number
  priceChange: number
  timeframe: TimeFrame
  isLoading: boolean
  error: string | null
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock chart data
const generateChartData = (timeframe: TimeFrame, basePrice: number = 43000) => {
  const config = {
    '1M': { points: 60, interval: 60000 }, // 1 minute
    '5M': { points: 60, interval: 300000 }, // 5 minutes
    '15M': { points: 48, interval: 900000 }, // 15 minutes
    '1H': { points: 24, interval: 3600000 }, // 1 hour
    '4H': { points: 24, interval: 14400000 }, // 4 hours
    '1D': { points: 30, interval: 86400000 } // 1 day
  }

  const { points, interval } = config[timeframe]
  const volatility = basePrice * 0.02 // 2% volatility
  const data: ChartDataPoint[] = []

  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - (points - i) * interval)
    const randomChange = (Math.random() - 0.5) * volatility
    const price = basePrice + randomChange + Math.sin(i / 5) * (volatility / 2)
    
    data.push({
      time: time.toISOString(),
      price: Math.max(price, basePrice - volatility),
      volume: Math.random() * 1000000000 // Random volume
    })
  }

  return data
}

// Async thunks
export const fetchChartData = createAsyncThunk(
  'market/fetchChartData',
  async (timeframe: TimeFrame) => {
    // Simulate API call
    await delay(500)
    
    // In a real app, this would be an API call
    // const response = await fetch(`/api/market/chart?timeframe=${timeframe}`)
    // const data = await response.json()
    
    const chartData = generateChartData(timeframe)
    const currentPrice = chartData[chartData.length - 1].price
    const firstPrice = chartData[0].price
    const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100
    
    return {
      chartData,
      currentPrice,
      priceChange,
      timeframe
    }
  }
)

export const updateLivePrice = createAsyncThunk(
  'market/updateLivePrice',
  async (_, { getState }) => {
    const state = getState() as { market: MarketState }
    const { chartData, currentPrice } = state.market
    
    if (chartData.length === 0) return null
    
    // Simulate price update
    const volatility = currentPrice * 0.001 // 0.1% volatility for live updates
    const change = (Math.random() - 0.5) * volatility
    const newPrice = currentPrice + change
    
    const newDataPoint: ChartDataPoint = {
      time: new Date().toISOString(),
      price: newPrice,
      volume: Math.random() * 1000000000
    }
    
    // Remove oldest point and add new one
    const updatedData = [...chartData.slice(1), newDataPoint]
    const firstPrice = updatedData[0].price
    const priceChange = ((newPrice - firstPrice) / firstPrice) * 100
    
    return {
      chartData: updatedData,
      currentPrice: newPrice,
      priceChange
    }
  }
)

const initialState: MarketState = {
  chartData: [],
  currentPrice: 43250,
  priceChange: 2.34,
  timeframe: '1H',
  isLoading: false,
  error: null
}

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<TimeFrame>) => {
      state.timeframe = action.payload
    },
    
    updateChartData: (state, action: PayloadAction<ChartDataPoint[]>) => {
      state.chartData = action.payload
      if (action.payload.length > 0) {
        state.currentPrice = action.payload[action.payload.length - 1].price
        const firstPrice = action.payload[0].price
        state.priceChange = ((state.currentPrice - firstPrice) / firstPrice) * 100
      }
    },
    
    setCurrentPrice: (state, action: PayloadAction<number>) => {
      state.currentPrice = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chart data cases
      .addCase(fetchChartData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.isLoading = false
        state.chartData = action.payload.chartData
        state.currentPrice = action.payload.currentPrice
        state.priceChange = action.payload.priceChange
        state.timeframe = action.payload.timeframe
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch chart data'
      })
      
      // Update live price cases
      .addCase(updateLivePrice.fulfilled, (state, action) => {
        if (action.payload) {
          state.chartData = action.payload.chartData
          state.currentPrice = action.payload.currentPrice
          state.priceChange = action.payload.priceChange
        }
      })
  }
})

export const { setTimeframe, updateChartData, setCurrentPrice, setError } = marketSlice.actions

export default marketSlice.reducer