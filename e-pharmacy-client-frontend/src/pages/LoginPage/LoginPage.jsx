import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, clearError } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import styles from './LoginPage.module.css'

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (token) navigate('/home')
    return () => { dispatch(clearError()) }
  }, [token, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/home')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.promo}>
        <div className={styles.promoContent}>
          <h1 className={styles.promoTitle}>Your medication, delivered</h1>
          <p className={styles.promoText}>Say goodbye to all your healthcare worries with us</p>
        </div>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.title}>Log In</h2>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input {...register('email')} type="email" placeholder="john@example.com" className={errors.email ? styles.inputError : styles.input} />
              {errors.email && <span className={styles.err}>{errors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={errors.password ? styles.inputError : styles.input} />
              {errors.password && <span className={styles.err}>{errors.password.message}</span>}
            </div>
            {error && <div className={styles.serverError}>{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
            <p className={styles.switchText}>Don&apos;t have an account? <Link to="/register" className={styles.switchLink}>Register</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
