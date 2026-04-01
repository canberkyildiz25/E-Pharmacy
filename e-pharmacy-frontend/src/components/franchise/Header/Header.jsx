import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logout, fetchUserInfo } from '../../../store/slices/authSlice'
import { useSelector } from 'react-redux'
import Logo from '../../franchise/Logo/Logo'
import styles from './Header.module.css'

function Header({ isAuth }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuth && !user) dispatch(fetchUserInfo())
  }, [isAuth, user, dispatch])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo to={isAuth ? '/shop' : '/register'} />
        {isAuth && (
          <nav className={styles.nav}>
            <NavLink to="/franchise/shop" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Mağazam</NavLink>
            <NavLink to="/franchise/orders" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Siparişler</NavLink>
            <NavLink to="/franchise/statistics" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>İstatistikler</NavLink>
            <button className={styles.logoutBtn} onClick={handleLogout}>Çıkış Yap</button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
