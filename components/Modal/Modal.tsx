'use client'

import classNames from 'classnames'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.sass'

interface Props {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
  size?: 'small' | 'medium'
  className?: string
  children?: React.ReactNode
}

const Modal = ({ title, subtitle, onClose, footer, size = 'small', className, children }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(styles.modal, styles[size], className)}
        onMouseDown={e => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        {children && <div className={styles.body}>{children}</div>}
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body
  )
}

export default Modal
