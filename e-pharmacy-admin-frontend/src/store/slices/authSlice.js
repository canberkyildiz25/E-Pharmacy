import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/user/unified-login', credentials)
    if (data.role === 'admin') {
      localStorage.setItem('token', data.token)
    }
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.get('/user/logout')
    localStorage.removeItem('token')
  } catch {
    localStorage.removeItem('token')
  }
})

export const fetchUserInfo = createAsyncThunk('auth/fetchUserInfo', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/user/user-info')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.role = action.payload.role
        if (action.payload.role === 'admin') {
          state.token = action.payload.token
          state.user = action.payload.user
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
