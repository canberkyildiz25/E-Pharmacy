import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import PrivateRoute from './components/PrivateRoute'

// Layouts
import AdminLayout    from './layouts/AdminLayout/AdminLayout'
import FranchiseLayout from './layouts/FranchiseLayout/FranchiseLayout'
import ClientLayout   from './layouts/ClientLayout/ClientLayout'

// Shared Auth Pages
import LoginPage    from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'

// Admin pages
import DashboardPage  from './pages/admin/DashboardPage/DashboardPage'
import OrdersPage     from './pages/admin/OrdersPage/OrdersPage'
import ProductsPage   from './pages/admin/ProductsPage/ProductsPage'
import SuppliersPage  from './pages/admin/SuppliersPage/SuppliersPage'
import CustomersPage  from './pages/admin/CustomersPage/CustomersPage'
import FranchisesPage from './pages/admin/FranchisesPage/FranchisesPage'

// Franchise pages
import ShopPage        from './pages/franchise/ShopPage/ShopPage'
import StatisticsPage  from './pages/franchise/StatisticsPage/StatisticsPage'
import CreateShopPage  from './pages/franchise/CreateShopPage/CreateShopPage'
import EditShopPage    from './pages/franchise/EditShopPage/EditShopPage'
import FranchiseMedicinePage from './pages/franchise/MedicinePage/MedicinePage'

// Client pages
import HomePage          from './pages/client/HomePage/HomePage'
import MedicineStorePage from './pages/client/MedicineStorePage/MedicineStorePage'
import MedicinePage      from './pages/client/MedicinePage/MedicinePage'
import ProductPage       from './pages/client/ProductPage/ProductPage'

// Role tabanlı varsayılan yönlendirme
function RoleRedirect() {
  const { token, user } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role === 'admin')     return <Navigate to="/admin/dashboard" replace />
  if (user?.role === 'franchise') return <Navigate to="/franchise/shop" replace />
  return <Navigate to="/home" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<RoleRedirect />} />

        {/* ── ADMIN ─────────────────────────────────── */}
        <Route path="/admin" element={
          <PrivateRoute role="admin"><AdminLayout /></PrivateRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<DashboardPage />} />
          <Route path="orders"     element={<OrdersPage />} />
          <Route path="products"   element={<ProductsPage />} />
          <Route path="suppliers"  element={<SuppliersPage />} />
          <Route path="customers"  element={<CustomersPage />} />
          <Route path="franchises" element={<FranchisesPage />} />
        </Route>

        {/* ── FRANCHISE ─────────────────────────────── */}
        <Route path="/franchise" element={
          <PrivateRoute role="franchise"><FranchiseLayout /></PrivateRoute>
        }>
          <Route index element={<Navigate to="shop" replace />} />
          <Route path="shop"        element={<ShopPage />} />
          <Route path="statistics"  element={<StatisticsPage />} />
          <Route path="create-shop" element={<CreateShopPage />} />
          <Route path="edit-shop"   element={<EditShopPage />} />
          <Route path="medicine"    element={<FranchiseMedicinePage />} />
        </Route>

        {/* ── CLIENT ────────────────────────────────── */}
        <Route path="/" element={<ClientLayout />}>
          <Route path="home"           element={<HomePage />} />
          <Route path="medicine-store" element={<MedicineStorePage />} />
          <Route path="medicine"       element={<MedicinePage />} />
          <Route path="product/:id"    element={<ProductPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
