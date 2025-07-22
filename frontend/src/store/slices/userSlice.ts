// store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'premium' | 'enterprise'
  lastLogin?: string
  preferences?: {
    theme: 'light' | 'dark'
    notifications: boolean
    currency: string
  }
}

interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Shashi Tiwari',
    email: 'shashi.tiwari@example.com',
    plan: 'premium' as const,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'dark' as const,
      notifications: true,
      currency: 'USD'
    }
  },
  {
    id: '2',
    name: 'Gudiya Choube',
    email: 'gudiya.choube@example.com',
    plan: 'enterprise' as const,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'dark' as const,
      notifications: true,
      currency: 'EUR'
    }
  },
  {
    id: '3',
    name: 'Rishu Tiwari',
    email: 'rishu.tiwari@example.com',
    plan: 'premium' as const,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'dark' as const,
      notifications: false,
      currency: 'USD'
    }
  }
]

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    // Simulate network delay
    await delay(1500)
    
    // In a real app, this would be an API call with auth token
    // const response = await fetch('/api/user/me', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // const data = await response.json()
    
    // Randomly select a user to simulate different logins
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    
    return randomUser
  }
)

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<User>) => {
    // Simulate network delay
    await delay(800)
    
    // In a real app, this would be an API call
    // const response = await fetch('/api/user/profile', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // })
    // const data = await response.json()
    
    return updates
  }
)

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    // Simulate network delay
    await delay(500)
    
    // In a real app, this would clear tokens and call logout API
    // await fetch('/api/auth/logout', { method: 'POST' })
    // localStorage.removeItem('authToken')
    
    return null
  }
)

const initialState: UserState = {
  currentUser: null,
  isLoading: true,
  error: null,
  isAuthenticated: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
      }
    },
    
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch user data'
        state.isAuthenticated = false
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentUser) {
          state.currentUser = { ...state.currentUser, ...action.payload }
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to update profile'
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.isAuthenticated = false
        state.isLoading = false
      })
  }
})

export const {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError
} = userSlice.actions

const userSliceReducer = userSlice.reducer
export default userSliceReducer