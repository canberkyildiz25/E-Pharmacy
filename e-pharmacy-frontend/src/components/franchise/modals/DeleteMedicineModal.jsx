import styles from './Modal.module.css'

function DeleteMedicineModal({ medicine, onConfirm, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalSmall} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Delete Medicine</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.deleteBody}>
          <span className={styles.deleteIcon}>🗑️</span>
          <p className={styles.deleteText}>
            Are you sure you want to delete <strong>{medicine.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteMedicineModal
