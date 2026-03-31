import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/user/register', data)
    localStorage.setItem('client_token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/user/login', data)
    localStorage.setItem('client_token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await api.get('/user/logout') } catch {}
  localStorage.removeItem('client_token')
})

export const fetchUserInfo = createAsyncThunk('auth/fetchUserInfo', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/user/user-info')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('client_token'),
    loading: false,
    error: null,
  },
  reducers: { clearError: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null })
      .addCase(fetchUserInfo.fulfilled, (state, action) => { state.user = action.payload })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
