import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface MetricData {
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  previousValue?: string | number
}

interface DashboardState {
  metrics: {
    totalMarketCap: MetricData
    volume24h: MetricData
    btcDominance: MetricData
    activeCoins: MetricData
  }
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: DashboardState = {
  metrics: {
    totalMarketCap: { value: '$0', change: 0, trend: 'neutral' },
    volume24h: { value: '$0', change: 0, trend: 'neutral' },
    btcDominance: { value: '0%', change: 0, trend: 'neutral' },
    activeCoins: { value: '0', change: 0, trend: 'neutral' },
  },
  loading: false,
  error: null,
  lastUpdated: null,
}

// Simulate backend fetch
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate backend response
    return {
      totalMarketCap: {
        value: '$1.78T',
        change: 2.34,
        trend: 'up' as const,
        previousValue: '$1.74T'
      },
      volume24h: {
        value: '$98.3B',
        change: -1.45,
        trend: 'down' as const,
        previousValue: '$99.7B'
      },
      btcDominance: {
        value: '52.3%',
        change: 0.8,
        trend: 'up' as const,
        previousValue: '51.9%'
      },
      activeCoins: {
        value: '2,341',
        change: 3.2,
        trend: 'up' as const,
        previousValue: '2,268'
      },
    }
  }
)

// Simulate real-time updates
export const updateMetric = createAsyncThunk(
  'dashboard/updateMetric',
  async ({ metric, change }: { metric: keyof DashboardState['metrics'], change: number }) => {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return { metric, change }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Real-time metric update
    updateMetricValue: (state, action: PayloadAction<{
      metric: keyof DashboardState['metrics']
      data: MetricData
    }>) => {
      state.metrics[action.payload.metric] = action.payload.data
      state.lastUpdated = new Date().toISOString()
    },
    
    // Batch update all metrics
    updateAllMetrics: (state, action: PayloadAction<DashboardState['metrics']>) => {
      state.metrics = action.payload
      state.lastUpdated = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false
        state.metrics = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch metrics'
      })
      
      // Update single metric
      .addCase(updateMetric.fulfilled, (state, action) => {
        const { metric, change } = action.payload
        const currentMetric = state.metrics[metric]
        
        // Calculate new value based on change
        if (metric === 'totalMarketCap') {
          const currentValue = parseFloat(currentMetric.value.toString().replace(/[$,T]/g, ''))
          const newValue = currentValue * (1 + change / 100)
          state.metrics[metric] = {
            ...currentMetric,
            value: `$${newValue.toFixed(2)}T`,
            change,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
          }
        }
        // Similar logic for other metrics...
        
        state.lastUpdated = new Date().toISOString()
      })
  },
})

export const { updateMetricValue, updateAllMetrics } = dashboardSlice.actions
const dashboardReducer = dashboardSlice.reducer
export default dashboardReducer