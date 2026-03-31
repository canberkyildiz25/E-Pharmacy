import { useState } from 'react'
import styles from './Modal.module.css'

const CATEGORIES = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care']

function AddMedicineModal({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'Medicine', warnings: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)) }
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.price.trim()) errs.price = 'Price is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    if (photo) formData.append('photo', photo)
    onSubmit(formData)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Medicine</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoSection}>
            <div className={styles.photoPreview}>
              {preview ? <img src={preview} alt="preview" /> : <span>💊</span>}
            </div>
            <label className={styles.uploadBtn}>
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhoto} hidden />
            </label>
          </div>
          <div className={styles.field}>
            <label>Medicine Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={errors.name ? styles.inputError : styles.input} placeholder="e.g. Aspirin" />
            {errors.name && <span className={styles.err}>{errors.name}</span>}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Price</label>
              <input name="price" value={form.price} onChange={handleChange} className={errors.price ? styles.inputError : styles.input} placeholder="e.g. 9.99" />
              {errors.price && <span className={styles.err}>{errors.price}</span>}
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={styles.input}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className={styles.input} rows={3} placeholder="Brief description..." />
          </div>
          <div className={styles.field}>
            <label>Warnings</label>
            <textarea name="warnings" value={form.warnings} onChange={handleChange} className={styles.input} rows={2} placeholder="Side effects, warnings..." />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Add Medicine</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMedicineModal
