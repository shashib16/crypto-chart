import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import cryptoReducer from './slices/cryptoSlice'
import marketReducer from './slices/marketSlice'
import chartSliceReducer from './slices/chartSlice'
import userSliceReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    crypto: cryptoReducer,
    market: marketReducer,
    chart: chartSliceReducer,
     user: userSliceReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch