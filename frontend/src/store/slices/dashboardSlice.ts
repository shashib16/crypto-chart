// store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface DashboardMetrics {
  totalMarketCap: string
  volume24h: string
  btcDominance: string
  activeCoins: string
  changes?: {
    totalMarketCap: number
    volume24h: number
    btcDominance: number
    activeCoins: number
  }
}

interface DashboardState {
  metrics: DashboardMetrics | null
  loading: boolean
  error: string | null
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Async thunk for fetching dashboard metrics
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async () => {
    // Simulate API call
    await delay(1000)
    
    // In a real app, this would be an API call
    // const response = await fetch('/api/dashboard/metrics')
    // const data = await response.json()
    
    return {
      totalMarketCap: '$1.78T',
      volume24h: '$98.3B',
      btcDominance: '52.3%',
      activeCoins: '2,341',
      changes: {
        totalMarketCap: 2.34,
        volume24h: -1.45,
        btcDominance: 0.8,
        activeCoins: 3.2
      }
    }
  }
)

const initialState: DashboardState = {
  metrics: null,
  loading: true,
  error: null
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateMetric: (state, action: PayloadAction<{ 
      metric: 'totalMarketCap' | 'volume24h' | 'btcDominance' | 'activeCoins'
      change: number 
    }>) => {
      if (state.metrics && state.metrics.changes) {
        const { metric, change } = action.payload
        
        // Update the change percentage
        state.metrics.changes[metric] = Number(change.toFixed(2))
        
        // Optionally update the actual value based on the change
        // This is a simplified example - in a real app, you'd calculate the new value
        switch (metric) {
          case 'totalMarketCap':
            // Parse current value, apply change, format back
            const currentCap = parseFloat(state.metrics.totalMarketCap.replace(/[$,T]/g, ''))
            const newCap = currentCap * (1 + change / 100)
            state.metrics.totalMarketCap = `$${newCap.toFixed(2)}T`
            break
          case 'volume24h':
            const currentVol = parseFloat(state.metrics.volume24h.replace(/[$,B]/g, ''))
            const newVol = currentVol * (1 + change / 100)
            state.metrics.volume24h = `$${newVol.toFixed(1)}B`
            break
          case 'btcDominance':
            const currentDom = parseFloat(state.metrics.btcDominance.replace('%', ''))
            const newDom = currentDom * (1 + change / 100)
            state.metrics.btcDominance = `${newDom.toFixed(1)}%`
            break
          case 'activeCoins':
            const currentCoins = parseInt(state.metrics.activeCoins.replace(',', ''))
            const newCoins = Math.round(currentCoins * (1 + change / 100))
            state.metrics.activeCoins = newCoins.toLocaleString()
            break
        }
      }
    },
    
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false
        state.metrics = action.payload
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch dashboard metrics'
      })
  }
})

export const { updateMetric, setMetrics, setLoading, setError } = dashboardSlice.actions

export default dashboardSlice.reducer