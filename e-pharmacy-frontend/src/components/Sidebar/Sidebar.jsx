import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/orders', label: 'Orders', icon: '📋' },
  { path: '/products', label: 'Products', icon: '💊' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
]

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            title={item.label}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
