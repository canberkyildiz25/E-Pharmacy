import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateCart = createAsyncThunk('cart/update', async (item, { rejectWithValue }) => {
  try {
    const res = await api.put('/cart/update', item)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const checkout = createAsyncThunk('cart/checkout', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/checkout', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items || [] })
      .addCase(updateCart.fulfilled, (state, action) => { state.items = action.payload.items || [] })
      .addCase(checkout.fulfilled, (state) => { state.items = [] })
  },
})

export default cartSlice.reducer
