import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface ChartDataPoint {
  time: string
  price: number
  volume?: number
}

interface MarketState {
  bitcoin: {
    currentPrice: number
    priceChange24h: number
    priceChangePercentage24h: number
    chartData: ChartDataPoint[]
    timeframe: '1M' | '5M' | '15M' | '1H' | '4H' | '1D'
  }
  loading: boolean
  error: string | null
  isConnected: boolean
}

const initialState: MarketState = {
  bitcoin: {
    currentPrice: 0,
    priceChange24h: 0,
    priceChangePercentage24h: 0,
    chartData: [],
    timeframe: '1H',
  },
  loading: false,
  error: null,
  isConnected: false,
}

// Simulate fetching historical data
export const fetchChartData = createAsyncThunk(
  'market/fetchChartData',
  async (timeframe: MarketState['bitcoin']['timeframe']) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const dataPoints = timeframe === '1M' ? 60 : 
                      timeframe === '5M' ? 60 :
                      timeframe === '15M' ? 48 :
                      timeframe === '1H' ? 24 :
                      timeframe === '4H' ? 24 : 30
    
    const basePrice = 43000
    const now = Date.now()
    const interval = timeframe === '1M' ? 60000 :
                    timeframe === '5M' ? 300000 :
                    timeframe === '15M' ? 900000 :
                    timeframe === '1H' ? 3600000 :
                    timeframe === '4H' ? 14400000 : 86400000
    
    const data: ChartDataPoint[] = Array.from({ length: dataPoints }, (_, i) => ({
      time: new Date(now - (dataPoints - i) * interval).toISOString(),
      price: basePrice + (Math.random() - 0.5) * 1000 + Math.sin(i / 5) * 500,
      volume: Math.random() * 1000000000
    }))
    
    return {
      chartData: data,
      currentPrice: data[data.length - 1].price,
      priceChange24h: data[data.length - 1].price - data[0].price,
      priceChangePercentage24h: ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
    }
  }
)

// Simulate real-time price update
export const updateLivePrice = createAsyncThunk(
  'market/updateLivePrice',
  async () => {
    const newPrice = 43000 + (Math.random() - 0.5) * 1000
    const time = new Date().toISOString()
    
    return {
      time,
      price: newPrice,
      volume: Math.random() * 100000000
    }
  }
)

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<MarketState['bitcoin']['timeframe']>) => {
      state.bitcoin.timeframe = action.payload
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    addDataPoint: (state, action: PayloadAction<ChartDataPoint>) => {
      state.bitcoin.chartData.push(action.payload)
      // Keep only necessary data points based on timeframe
      const maxPoints = state.bitcoin.timeframe === '1M' ? 60 : 
                       state.bitcoin.timeframe === '5M' ? 60 : 48
      if (state.bitcoin.chartData.length > maxPoints) {
        state.bitcoin.chartData = state.bitcoin.chartData.slice(-maxPoints)
      }
      
      // Update current price and calculate changes
      state.bitcoin.currentPrice = action.payload.price
      const firstPrice = state.bitcoin.chartData[0].price
      state.bitcoin.priceChange24h = action.payload.price - firstPrice
      state.bitcoin.priceChangePercentage24h = ((action.payload.price - firstPrice) / firstPrice) * 100
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false
        state.bitcoin = {
          ...state.bitcoin,
          ...action.payload
        }
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch chart data'
      })
      
      .addCase(updateLivePrice.fulfilled, (state, action) => {
        marketSlice.caseReducers.addDataPoint(state, {
          payload: action.payload,
          type: 'market/addDataPoint'
        })
      })
  },
})

export const { setTimeframe, setConnected, addDataPoint } = marketSlice.actions
const marketReducer = marketSlice.reducer
export default marketReducer