import { configureStore } from '@reduxjs/toolkit'
import authReducer       from './slices/authSlice'
// Admin
import dashboardReducer  from './slices/dashboardSlice'
import ordersReducer     from './slices/ordersSlice'
import productsReducer   from './slices/productsSlice'
import suppliersReducer  from './slices/suppliersSlice'
import customersReducer  from './slices/customersSlice'
// Franchise
import shopReducer           from './slices/shopSlice'
import statisticsReducer     from './slices/statisticsSlice'
import franchiseMedicineReducer from './slices/franchiseMedicineSlice'
// Client
import cartReducer           from './slices/cartSlice'
import clientMedicineReducer from './slices/clientMedicineSlice'
import storeReducer          from './slices/storeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // admin
    dashboard:  dashboardReducer,
    orders:     ordersReducer,
    products:   productsReducer,
    suppliers:  suppliersReducer,
    customers:  customersReducer,
    // franchise
    shop:              shopReducer,
    statistics:        statisticsReducer,
    franchiseMedicine: franchiseMedicineReducer,
    // client
    cart:            cartReducer,
    clientMedicine:  clientMedicineReducer,
    store:           storeReducer,
  },
})
