import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import styles from './SharedLayout.module.css'

function SharedLayout() {
  const { token } = useSelector((state) => state.auth)
  return (
    <div className={styles.layout}>
      <Header isAuth={!!token} />
      <main className={styles.main}>
        <Outlet />
      </main>
      {!!token && <Footer />}
    </div>
  )
}

export default SharedLayout
