'use client'

import classNames from 'classnames'
import Link from 'next/link'
import Tooltip from '../Tooltip'
import styles from './ServerRail.module.sass'

interface Props {
  label: string
  href?: string
  onClick?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
  active?: boolean
  unread?: boolean
  mentions?: number
  variant?: 'home' | 'server' | 'action'
  /** Drag-and-drop handlers and state for reorderable items */
  dragProps?: React.HTMLAttributes<HTMLDivElement>
  dropIndicator?: 'before' | 'after' | null
  children: React.ReactNode
}

const RailItem = ({
  label,
  href,
  onClick,
  onContextMenu,
  active,
  unread,
  mentions = 0,
  variant = 'server',
  dragProps,
  dropIndicator,
  children,
}: Props) => {
  const icon = (
    <div
      className={classNames(styles.icon, styles[variant], active && styles.active)}
      aria-hidden
    >
      {children}
    </div>
  )

  return (
    <div
      className={classNames(
        styles.item,
        active && styles.itemActive,
        unread && styles.itemUnread,
        dropIndicator === 'before' && styles.dropBefore,
        dropIndicator === 'after' && styles.dropAfter
      )}
      {...dragProps}
    >
      <span className={styles.pill} />
      <Tooltip label={label} placement="right" large>
        {href ? (
          <Link href={href} className={styles.button} aria-label={label} onContextMenu={onContextMenu}>
            {icon}
          </Link>
        ) : (
          <button
            type="button"
            className={styles.button}
            aria-label={label}
            onClick={onClick}
            onContextMenu={onContextMenu}
          >
            {icon}
          </button>
        )}
      </Tooltip>
      {mentions > 0 && (
        <span className={styles.badge}>{mentions > 99 ? '99+' : mentions}</span>
      )}
    </div>
  )
}

export default RailItem
