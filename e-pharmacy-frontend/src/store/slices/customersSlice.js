import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCustomers = createAsyncThunk('customers/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/customers', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const customersSlice = createSlice({
  name: 'customers',
  initialState: { items: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.customers
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCustomers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default customersSlice.reducer
