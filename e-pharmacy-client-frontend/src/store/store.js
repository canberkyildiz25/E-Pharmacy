import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import medicineReducer from './slices/medicineSlice'
import storeReducer from './slices/storeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    medicine: medicineReducer,
    store: storeReducer,
  },
})
