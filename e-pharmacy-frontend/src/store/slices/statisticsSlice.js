import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchStatistics = createAsyncThunk('statistics/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/statistics')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchClientGoods = createAsyncThunk('statistics/fetchClientGoods', async (clientId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/statistics/${clientId}/goods`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: { data: null, clientGoods: null, loading: false, error: null },
  reducers: { clearClientGoods: (state) => { state.clientGoods = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => { state.loading = true })
      .addCase(fetchStatistics.fulfilled, (state, action) => { state.loading = false; state.data = action.payload })
      .addCase(fetchStatistics.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchClientGoods.fulfilled, (state, action) => { state.clientGoods = action.payload })
  },
})

export const { clearClientGoods } = statisticsSlice.actions
export default statisticsSlice.reducer
