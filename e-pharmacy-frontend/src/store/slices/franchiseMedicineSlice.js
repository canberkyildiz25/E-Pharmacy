import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMedicineDetail = createAsyncThunk('medicine/fetchDetail', async ({ shopId, productId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/shop/${shopId}/product/${productId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const medicineSlice = createSlice({
  name: 'franchiseMedicine',
  initialState: { detail: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicineDetail.pending, (state) => { state.loading = true })
      .addCase(fetchMedicineDetail.fulfilled, (state, action) => { state.loading = false; state.detail = action.payload })
      .addCase(fetchMedicineDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default medicineSlice.reducer
