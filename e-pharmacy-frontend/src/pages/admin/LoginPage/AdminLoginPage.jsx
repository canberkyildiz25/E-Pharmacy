import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, clearError } from '../../../store/slices/authSlice'
import styles from './LoginPage.module.css'

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (token) navigate('/admin/dashboard')
    return () => { dispatch(clearError()) }
  }, [token, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      if (result.payload.role === 'franchise') {
        window.location.href = `http://localhost:5174/auto-login?token=${result.payload.token}`
      } else {
        navigate('/admin/dashboard')
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoIcon}>💊</span>
          <h1 className={styles.title}>Medicine Store</h1>
          <p className={styles.subtitle}>Admin Panel Login</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Enter your password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>
          {error && <div className={styles.serverError}>{error}</div>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In Now'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
