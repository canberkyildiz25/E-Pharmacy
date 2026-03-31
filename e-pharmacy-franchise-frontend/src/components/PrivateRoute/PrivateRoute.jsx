import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('franchise_token')
  return token ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
