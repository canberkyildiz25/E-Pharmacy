import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/slices/authSlice'
import { useEffect } from 'react'
import { fetchUserInfo } from '../../../store/slices/authSlice'
import styles from './Header.module.css'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) dispatch(fetchUserInfo())
  }, [dispatch, user])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/admin/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>💊</span>
          <span className={styles.logoText}>Medicine Store</span>
        </Link>
      </div>
      <div className={styles.right}>
        <Link to="/admin/dashboard" className={styles.subtitle}>Dashboard</Link>
        <span className={styles.email}>{user?.email || 'vendor@gmail.com'}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </header>
  )
}

export default Header
