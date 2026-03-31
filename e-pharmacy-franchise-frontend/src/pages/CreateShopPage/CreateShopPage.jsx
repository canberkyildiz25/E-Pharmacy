import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createShop } from '../../store/slices/shopSlice'
import { fetchUserInfo } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import styles from './CreateShopPage.module.css'

const schema = yup.object({
  shopName: yup.string().required('Shop name is required'),
  ownerName: yup.string().required('Owner name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip code is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})

function CreateShopPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.shop)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [delivery, setDelivery] = useState('false')

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, val]) => formData.append(key, val))
    formData.append('hasOwnDelivery', delivery)
    if (logoFile) formData.append('logo', logoFile)

    const result = await dispatch(createShop(formData))
    if (createShop.fulfilled.match(result)) {
      await dispatch(fetchUserInfo())
      toast.success('Shop created successfully!')
      navigate('/shop')
    } else {
      toast.error(result.payload || 'Failed to create shop')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create your Shop</h1>
          <p className={styles.subtitle}>This information will be displayed publicly so be careful what you share.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.logoSection}>
            <div className={styles.logoPreview}>
              {logoPreview ? <img src={logoPreview} alt="Logo" className={styles.logoImg} /> : <span className={styles.logoPlaceholder}>💊</span>}
            </div>
            <label className={styles.uploadBtn}>
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
            </label>
          </div>
          <div className={styles.grid}>
            {[
              { name: 'shopName', label: 'Shop Name', placeholder: 'My Pharmacy' },
              { name: 'ownerName', label: 'Shop Owner Name', placeholder: 'John Doe' },
              { name: 'email', label: 'Email Address', placeholder: 'shop@email.com', type: 'email' },
              { name: 'phone', label: 'Phone Number', placeholder: '+1 234 567 8900' },
              { name: 'streetAddress', label: 'Street Address', placeholder: '123 Main St' },
              { name: 'city', label: 'City', placeholder: 'New York' },
              { name: 'zipCode', label: 'Zip / Postal', placeholder: '10001' },
              { name: 'password', label: 'Password', placeholder: '••••••', type: 'password' },
            ].map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name} className={styles.field}>
                <label>{label}</label>
                <input {...register(name)} type={type} placeholder={placeholder} className={errors[name] ? styles.inputError : styles.input} />
                {errors[name] && <span className={styles.err}>{errors[name].message}</span>}
              </div>
            ))}
          </div>
          <div className={styles.deliveryField}>
            <label className={styles.deliveryLabel}>Has Own Delivery System?</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" value="true" checked={delivery === 'true'} onChange={() => setDelivery('true')} />
                Yes
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" value="false" checked={delivery === 'false'} onChange={() => setDelivery('false')} />
                No
              </label>
            </div>
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateShopPage
