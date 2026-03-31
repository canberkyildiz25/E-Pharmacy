import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

function Logo({ to = '/' }) {
  return (
    <Link to={to} className={styles.logo}>
      <span className={styles.icon}>💊</span>
      <span className={styles.text}>E-Pharmacy</span>
    </Link>
  )
}

export default Logo
