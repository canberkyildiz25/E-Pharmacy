import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, fetchUserInfo } from '../../../store/slices/authSlice'
import { fetchCart } from '../../../store/slices/cartSlice'
import { useEffect } from 'react'
import styles from './Header.module.css'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)

  useEffect(() => {
    if (token && !user) dispatch(fetchUserInfo())
    if (token) dispatch(fetchCart())
  }, [token, user, dispatch])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/home')
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/home" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="8" fill="#3BCC70"/><path d="M14 6v16M6 14h16" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
          <span className={styles.logoText}>E-Pharmacy</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/home" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Ana Sayfa</NavLink>
          <NavLink to="/medicine-store" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Eczaneler</NavLink>
          <NavLink to="/medicine" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>İlaçlar</NavLink>
        </nav>

        <div className={styles.auth}>
          {token ? (
            <>
              <span className={styles.userName}>{user?.name}</span>
              <Link to="/medicine" className={styles.cartBtn}>
                🛒 {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link to="/register" className={styles.registerBtn}>Kayıt Ol</Link>
              <Link to="/login" className={styles.loginBtn}>Giriş Yap</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
