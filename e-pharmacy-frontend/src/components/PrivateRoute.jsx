import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// role prop verilirse o role'e özel koruma sağlar
function PrivateRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth)

  if (!token) return <Navigate to="/login" replace />

  if (role && user && user.role !== role) {
    // Yanlış role ile erişim → kendi paneline yönlendir
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'franchise') return <Navigate to="/franchise/shop" replace />
    return <Navigate to="/home" replace />
  }

  return children
}

export default PrivateRoute
