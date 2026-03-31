import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import shopReducer from './slices/shopSlice'
import medicineReducer from './slices/medicineSlice'
import statisticsReducer from './slices/statisticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    medicine: medicineReducer,
    statistics: statisticsReducer,
  },
})
