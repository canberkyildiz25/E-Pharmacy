import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchOrders = createAsyncThunk('orders/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default ordersSlice.reducer
