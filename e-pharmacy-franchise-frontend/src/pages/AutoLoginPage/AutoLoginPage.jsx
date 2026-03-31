import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AutoLoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('franchise_token', token)
      navigate('/shop', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#747479', fontSize: 16 }}>Redirecting...</p>
    </div>
  )
}

export default AutoLoginPage
