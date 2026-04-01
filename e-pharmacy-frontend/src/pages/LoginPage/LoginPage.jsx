import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, clearError } from '../../store/slices/authSlice'
import { fetchUserInfo } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import styles from './LoginPage.module.css'

const schema = yup.object({
  email: yup.string().email('Geçersiz e-posta adresi').required('E-posta zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
})

const ROLES = [
  { key: 'client',    label: 'Müşteri Girişi',  icon: '👤', desc: 'İlaç sipariş etmek için giriş yapın' },
  { key: 'franchise', label: 'Eczane Girişi',   icon: '🏪', desc: 'Eczanenizi yönetmek için giriş yapın' },
  { key: 'admin',     label: 'Admin Girişi',    icon: '⚙️', desc: 'Sistem yönetimi için giriş yapın' },
]

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token, user } = useSelector((state) => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [roleTab, setRoleTab] = useState('client')

  const activeRole = ROLES.find(r => r.key === roleTab)

  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin')          navigate('/admin/dashboard', { replace: true })
      else if (user.role === 'franchise') navigate('/franchise/shop', { replace: true })
      else                                navigate('/home', { replace: true })
    }
    return () => { dispatch(clearError()) }
  }, [token, user, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success('Hoş geldiniz!')
      const role = result.payload.user?.role
      if (role === 'admin')          navigate('/admin/dashboard', { replace: true })
      else if (role === 'franchise') navigate('/franchise/shop', { replace: true })
      else                           navigate('/home', { replace: true })
    } else {
      toast.error(result.payload || 'Giriş başarısız')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.promo}>
        <div className={styles.promoContent}>
          <h1 className={styles.promoTitle}>E-Pharmacy</h1>
          <p className={styles.promoText}>Müşteri, eczane sahibi veya yönetici — tek platformda herşey</p>
          <div className={styles.promoBadges}>
            <span className={styles.badge}>👤 Müşteri</span>
            <span className={styles.badge}>🏪 Franchise</span>
            <span className={styles.badge}>⚙️ Admin</span>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formCard}>

          {/* Rol Sekmeleri */}
          <div className={styles.roleTabs}>
            {ROLES.map(r => (
              <button
                key={r.key}
                type="button"
                className={`${styles.roleTab} ${roleTab === r.key ? styles.roleTabActive : ''}`}
                onClick={() => setRoleTab(r.key)}
              >
                <span>{r.icon}</span>
                <span>{r.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className={styles.roleInfo}>
            <span className={styles.roleInfoIcon}>{activeRole.icon}</span>
            <div>
              <p className={styles.roleInfoTitle}>{activeRole.label}</p>
              <p className={styles.roleInfoDesc}>{activeRole.desc}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>E-posta Adresi</label>
              <input {...register('email')} type="email" placeholder="ornek@mail.com" className={errors.email ? styles.inputError : styles.input} />
              {errors.email && <span className={styles.err}>{errors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Şifre</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={errors.password ? styles.inputError : styles.input} />
              {errors.password && <span className={styles.err}>{errors.password.message}</span>}
            </div>
            {error && <div className={styles.serverError}>{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            <p className={styles.switchText}>
              Hesabınız yok mu? <Link to="/register" className={styles.switchLink}>Kayıt Ol</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
