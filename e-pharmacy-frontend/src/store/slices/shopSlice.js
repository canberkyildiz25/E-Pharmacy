import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const createShop = createAsyncThunk('shop/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/shop/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create shop')
  }
})

export const fetchShop = createAsyncThunk('shop/fetch', async (shopId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/shop/${shopId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateShop = createAsyncThunk('shop/update', async ({ shopId, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/shop/${shopId}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchMedicines = createAsyncThunk('shop/fetchMedicines', async ({ shopId, params = {} }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/shop/${shopId}/product`, { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addMedicine = createAsyncThunk('shop/addMedicine', async ({ shopId, formData }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/shop/${shopId}/product/add`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const editMedicine = createAsyncThunk('shop/editMedicine', async ({ shopId, productId, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/shop/${shopId}/product/${productId}/edit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteMedicine = createAsyncThunk('shop/deleteMedicine', async ({ shopId, productId }, { rejectWithValue }) => {
  try {
    await api.delete(`/shop/${shopId}/product/${productId}/delete`)
    return productId
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const shopSlice = createSlice({
  name: 'shop',
  initialState: { shop: null, medicines: [], categories: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShop.fulfilled, (state, action) => { state.shop = action.payload })
      .addCase(createShop.fulfilled, (state, action) => { state.shop = action.payload })
      .addCase(updateShop.fulfilled, (state, action) => { state.shop = action.payload })
      .addCase(fetchMedicines.pending, (state) => { state.loading = true })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false
        state.medicines = action.payload.medicines
        state.categories = action.payload.categories
        state.pagination = action.payload.pagination
      })
      .addCase(fetchMedicines.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(addMedicine.fulfilled, (state, action) => { state.medicines.unshift(action.payload) })
      .addCase(editMedicine.fulfilled, (state, action) => {
        const idx = state.medicines.findIndex(m => m._id === action.payload._id)
        if (idx !== -1) state.medicines[idx] = action.payload
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter(m => m._id !== action.payload)
      })
  },
})

export default shopSlice.reducer
