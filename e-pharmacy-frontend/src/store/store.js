import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import suppliersReducer from './slices/suppliersSlice'
import customersReducer from './slices/customersSlice'
import ordersReducer from './slices/ordersSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    suppliers: suppliersReducer,
    customers: customersReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer,
  },
})
