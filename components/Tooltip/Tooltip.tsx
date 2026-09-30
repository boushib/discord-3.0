'use client'

import classNames from 'classnames'
import { cloneElement, ReactElement, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.sass'

type Placement = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  label: React.ReactNode
  placement?: Placement
  /** Larger text, used for server names in the rail */
  large?: boolean
  disabled?: boolean
  children: ReactElement<React.HTMLAttributes<HTMLElement>>
}

const GAP = 8

const position = (rect: DOMRect, placement: Placement) => {
  switch (placement) {
    case 'right':
      return { left: rect.right + GAP, top: rect.top + rect.height / 2 }
    case 'left':
      return { left: rect.left - GAP, top: rect.top + rect.height / 2 }
    case 'bottom':
      return { left: rect.left + rect.width / 2, top: rect.bottom + GAP }
    default:
      return { left: rect.left + rect.width / 2, top: rect.top - GAP }
  }
}

/** Discord-style dark tooltip rendered in a portal so it never gets clipped */
const Tooltip = ({ label, placement = 'top', large, disabled, children }: Props) => {
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null)

  const show = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) =>
    setCoords(position(e.currentTarget.getBoundingClientRect(), placement))
  const hide = () => setCoords(null)

  const trigger = cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(e)
      show(e)
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e)
      if (e.currentTarget.matches(':focus-visible')) show(e)
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e)
      hide()
    },
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(e)
      hide()
    },
  })

  return (
    <>
      {trigger}
      {coords &&
        !disabled &&
        createPortal(
          <div
            role="tooltip"
            className={classNames(styles.tooltip, styles[placement], large && styles.large)}
            style={coords}
          >
            {label}
          </div>,
          document.body
        )}
    </>
  )
}

export default Tooltip
