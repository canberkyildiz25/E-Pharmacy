import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchNearestStores = createAsyncThunk('store/fetchNearest', async (coords, { rejectWithValue }) => {
  try {
    const params = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : ''
    const res = await api.get(`/stores/nearest${params}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAllStores = createAsyncThunk('store/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/stores')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchStoreDetail = createAsyncThunk('store/fetchDetail', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/stores/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const storeSlice = createSlice({
  name: 'store',
  initialState: { nearest: [], all: [], detail: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearestStores.fulfilled, (state, action) => { state.nearest = action.payload })
      .addCase(fetchAllStores.fulfilled, (state, action) => { state.all = action.payload })
      .addCase(fetchStoreDetail.fulfilled, (state, action) => { state.detail = action.payload })
  },
})

export default storeSlice.reducer
