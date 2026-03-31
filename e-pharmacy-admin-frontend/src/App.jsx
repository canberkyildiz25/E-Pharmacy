import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage/LoginPage'
import SharedLayout from './layouts/SharedLayout/SharedLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import SuppliersPage from './pages/SuppliersPage/SuppliersPage'
import CustomersPage from './pages/CustomersPage/CustomersPage'
import FranchisesPage from './pages/FranchisesPage/FranchisesPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><SharedLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="franchises" element={<FranchisesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
