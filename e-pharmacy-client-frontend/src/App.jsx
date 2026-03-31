import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import SharedLayout from './layouts/SharedLayout/SharedLayout'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import MedicineStorePage from './pages/MedicineStorePage/MedicineStorePage'
import MedicinePage from './pages/MedicinePage/MedicinePage'
import ProductPage from './pages/ProductPage/ProductPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="medicine-store" element={<MedicineStorePage />} />
            <Route path="medicine" element={<PrivateRoute><MedicinePage /></PrivateRoute>} />
            <Route path="product/:id" element={<ProductPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
