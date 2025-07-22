// store/slices/chartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TimeFrame = '1M' | '5M' | '15M' | '1H' | '4H' | '1D'

interface ChartDataPoint {
  time: string
  timeFormatted: string
  price: number
}

interface ChartState {
  data: ChartDataPoint[]
  currentPrice: number
  timeframe: TimeFrame
  priceChange: number
  isLoading: boolean
  error: string | null
  cryptoId: number | null
  cryptoSymbol: string
}

const timeframeConfig: Record<TimeFrame, { points: number; interval: number }> = {
  '1M': { points: 60, interval: 1000 },
  '5M': { points: 60, interval: 5000 },
  '15M': { points: 48, interval: 15000 },
  '1H': { points: 24, interval: 60000 },
  '4H': { points: 24, interval: 240000 },
  '1D': { points: 30, interval: 3600000 }
}

const formatTime = (date: Date, tf: TimeFrame): string => {
  if (tf === '1M') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else if (tf === '5M' || tf === '15M' || tf === '1H' || tf === '4H') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const initialState: ChartState = {
  data: [],
  currentPrice: 43250,
  timeframe: '1H',
  priceChange: 2.34,
  isLoading: false,
  error: null,
  cryptoId: 1, // Default to Bitcoin
  cryptoSymbol: 'BTC'
}

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<TimeFrame>) => {
      state.timeframe = action.payload
    },
    setCrypto: (state, action: PayloadAction<{ id: number; symbol: string; price: number }>) => {
      state.cryptoId = action.payload.id
      state.cryptoSymbol = action.payload.symbol
      state.currentPrice = action.payload.price
    },
    initializeData: (state, action: PayloadAction<{ timeframe: TimeFrame; basePrice?: number }>) => {
      const { timeframe, basePrice = state.currentPrice } = action.payload
      const config = timeframeConfig[timeframe]
      
      // Different volatility based on crypto price
      const volatilityFactor = basePrice > 1000 ? 0.01 : basePrice > 100 ? 0.02 : basePrice > 10 ? 0.03 : 0.05
      const volatility = basePrice * volatilityFactor

      const newData: ChartDataPoint[] = Array.from({ length: config.points }, (_, i) => {
        const timeOffset = (config.points - i) * config.interval
        const time = new Date(Date.now() - timeOffset)
        const randomPrice = basePrice + (Math.random() - 0.5) * volatility + Math.sin(i / 5) * (volatility / 2)
        
        return {
          time: time.toISOString(),
          timeFormatted: formatTime(time, timeframe),
          price: Math.max(randomPrice, basePrice - volatility / 2)
        }
      })

      state.data = newData
      
      if (newData.length > 0) {
        state.currentPrice = newData[newData.length - 1].price
        const change = ((newData[newData.length - 1].price - newData[0].price) / newData[0].price * 100)
        state.priceChange = change
      }
    },
    updatePrice: (state, action: PayloadAction<{ price: number; time: string; timeFormatted: string }>) => {
      const { price, time, timeFormatted } = action.payload
      
      state.currentPrice = price
      state.data = [...state.data.slice(1), {
        time,
        timeFormatted,
        price
      }]
      
      if (state.data.length > 0) {
        const change = ((state.data[state.data.length - 1].price - state.data[0].price) / state.data[0].price * 100)
        state.priceChange = change
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const { 
  setTimeframe, 
  setCrypto,
  updatePrice, 
  initializeData, 
  setLoading, 
  setError 
} = chartSlice.actions

const chartSliceReducer = chartSlice.reducer
export default chartSliceReducer