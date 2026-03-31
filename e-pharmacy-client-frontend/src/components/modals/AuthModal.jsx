import { Link } from 'react-router-dom'
import styles from './AuthModal.module.css'

function AuthModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <span className={styles.icon}>🔒</span>
        <h2 className={styles.title}>Login Required</h2>
        <p className={styles.text}>You need to be logged in to add items to your cart.</p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn} onClick={onClose}>Log In</Link>
          <Link to="/register" className={styles.registerBtn} onClick={onClose}>Register</Link>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
