import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchShop, updateShop } from '../../store/slices/shopSlice'
import { toast } from 'react-hot-toast'
import styles from './EditShopPage.module.css'

const schema = yup.object({
  shopName: yup.string().required('Shop name is required'),
  ownerName: yup.string().required('Owner name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip code is required'),
})

function EditShopPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { shop, loading } = useSelector((state) => state.shop)
  const { user } = useSelector((state) => state.auth)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [delivery, setDelivery] = useState('false')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (user?.shopId && !shop) dispatch(fetchShop(user.shopId))
  }, [user, shop, dispatch])

  useEffect(() => {
    if (shop) {
      reset({
        shopName: shop.shopName, ownerName: shop.ownerName,
        email: shop.email, phone: shop.phone,
        streetAddress: shop.streetAddress, city: shop.city, zipCode: shop.zipCode,
      })
      setDelivery(shop.hasOwnDelivery ? 'true' : 'false')
      if (shop.logo) setLogoPreview(`http://localhost:5001${shop.logo}`)
    }
  }, [shop, reset])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) }
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, v))
    formData.append('hasOwnDelivery', delivery)
    if (logoFile) formData.append('logo', logoFile)
    const result = await dispatch(updateShop({ shopId: shop._id, formData }))
    if (updateShop.fulfilled.match(result)) {
      toast.success('Shop updated successfully!')
      navigate('/shop')
    } else toast.error('Failed to update shop')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit data</h1>
          <p className={styles.subtitle}>This information will be displayed publicly so be careful what you share.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.logoSection}>
            <div className={styles.logoPreview}>
              {logoPreview ? <img src={logoPreview} alt="Logo" className={styles.logoImg} /> : <span>💊</span>}
            </div>
            <label className={styles.uploadBtn}>
              Change Logo
              <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
            </label>
          </div>
          <div className={styles.grid}>
            {[
              { name: 'shopName', label: 'Shop Name' },
              { name: 'ownerName', label: 'Shop Owner Name' },
              { name: 'email', label: 'Email Address', type: 'email' },
              { name: 'phone', label: 'Phone Number' },
              { name: 'streetAddress', label: 'Street Address' },
              { name: 'city', label: 'City' },
              { name: 'zipCode', label: 'Zip / Postal' },
            ].map(({ name, label, type = 'text' }) => (
              <div key={name} className={styles.field}>
                <label>{label}</label>
                <input {...register(name)} type={type} className={errors[name] ? styles.inputError : styles.input} />
                {errors[name] && <span className={styles.err}>{errors[name].message}</span>}
              </div>
            ))}
          </div>
          <div className={styles.deliveryField}>
            <label className={styles.deliveryLabel}>Has Own Delivery System?</label>
            <div className={styles.radioGroup}>
              <label><input type="radio" value="true" checked={delivery === 'true'} onChange={() => setDelivery('true')} /> Yes</label>
              <label><input type="radio" value="false" checked={delivery === 'false'} onChange={() => setDelivery('false')} /> No</label>
            </div>
          </div>
          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/shop')}>Cancel</button>
            <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditShopPage
