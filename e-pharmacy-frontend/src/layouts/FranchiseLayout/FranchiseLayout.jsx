import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/franchise/Header/Header'
import Footer from '../../components/franchise/Footer/Footer'
import styles from './FranchiseLayout.module.css'

function FranchiseLayout() {
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

export default FranchiseLayout
