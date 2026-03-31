import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSuppliers = createAsyncThunk('suppliers/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/suppliers', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addSupplier = createAsyncThunk('suppliers/add', async (supplierData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/suppliers', supplierData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateSupplier = createAsyncThunk('suppliers/update', async ({ id, data: supplierData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/suppliers/${id}`, supplierData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => { state.loading = true })
      .addCase(fetchSuppliers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchSuppliers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(addSupplier.fulfilled, (state, action) => { state.items.unshift(action.payload) })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const idx = state.items.findIndex(s => s._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export default suppliersSlice.reducer
