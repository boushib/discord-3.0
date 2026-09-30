import classNames from 'classnames'
import styles from './Menu.module.sass'

export const Menu = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div role="menu" className={classNames(styles.menu, className)}>
    {children}
  </div>
)

interface ItemProps {
  label: React.ReactNode
  icon?: React.ReactNode
  hint?: React.ReactNode
  danger?: boolean
  brand?: boolean
  checked?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const MenuItem = ({ label, icon, hint, danger, brand, checked, disabled, onClick }: ItemProps) => (
  <button
    type="button"
    role="menuitem"
    disabled={disabled}
    className={classNames(styles.item, danger && styles.danger, brand && styles.brand)}
    onClick={onClick}
  >
    <span className={styles.label}>
      {label}
      {hint && <span className={styles.hint}>{hint}</span>}
    </span>
    {checked !== undefined ? (
      <span className={classNames(styles.check, checked && styles.checked)} />
    ) : (
      icon && <span className={styles.icon}>{icon}</span>
    )}
  </button>
)

export const MenuSeparator = () => <div className={styles.separator} role="separator" />
