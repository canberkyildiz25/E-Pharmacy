import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SharedLayout from './layouts/SharedLayout/SharedLayout'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import LoginPage from './pages/LoginPage/LoginPage'
import CreateShopPage from './pages/CreateShopPage/CreateShopPage'
import EditShopPage from './pages/EditShopPage/EditShopPage'
import ShopPage from './pages/ShopPage/ShopPage'
import MedicinePage from './pages/MedicinePage/MedicinePage'
import StatisticsPage from './pages/StatisticsPage/StatisticsPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import AutoLoginPage from './pages/AutoLoginPage/AutoLoginPage'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Navigate to="/register" replace />} />
          <Route path="auto-login" element={<AutoLoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="create-shop" element={<PrivateRoute><CreateShopPage /></PrivateRoute>} />
          <Route path="edit-shop" element={<PrivateRoute><EditShopPage /></PrivateRoute>} />
          <Route path="shop" element={<PrivateRoute><ShopPage /></PrivateRoute>} />
          <Route path="medicine/:id" element={<PrivateRoute><MedicinePage /></PrivateRoute>} />
          <Route path="statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
