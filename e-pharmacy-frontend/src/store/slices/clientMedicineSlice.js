import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMedicines = createAsyncThunk('medicine/fetchList', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/medicines', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchMedicineDetail = createAsyncThunk('medicine/fetchDetail', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/medicines/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const medicineSlice = createSlice({
  name: 'clientMedicine',
  initialState: { list: [], categories: [], pagination: null, detail: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => { state.loading = true })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.medicines
        state.categories = action.payload.categories
        state.pagination = action.payload.pagination
      })
      .addCase(fetchMedicines.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMedicineDetail.pending, (state) => { state.loading = true })
      .addCase(fetchMedicineDetail.fulfilled, (state, action) => { state.loading = false; state.detail = action.payload })
      .addCase(fetchMedicineDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default medicineSlice.reducer
