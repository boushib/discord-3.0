'use client'

import classNames from 'classnames'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useOnClickOutside } from '../../hooks'
import styles from './Popover.module.sass'

export type Placement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom-center'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'left-start'

interface Props {
  /** Bounding rect of the element that opened the popover */
  anchor: DOMRect
  placement?: Placement
  offset?: number
  onClose: () => void
  className?: string
  children: React.ReactNode
}

const MARGIN = 8

const initialPosition = (a: DOMRect, placement: Placement, offset: number) => {
  switch (placement) {
    case 'bottom-start':
      return { top: a.bottom + offset, left: a.left }
    case 'bottom-end':
      return { top: a.bottom + offset, left: a.right, transform: 'translateX(-100%)' }
    case 'bottom-center':
      return { top: a.bottom + offset, left: a.left + a.width / 2, transform: 'translateX(-50%)' }
    case 'top-start':
      return { top: a.top - offset, left: a.left, transform: 'translateY(-100%)' }
    case 'top-end':
      return { top: a.top - offset, left: a.right, transform: 'translate(-100%, -100%)' }
    case 'right-start':
      return { top: a.top, left: a.right + offset }
    case 'left-start':
      return { top: a.top, left: a.left - offset, transform: 'translateX(-100%)' }
  }
}

/** Floating layer anchored to a rect; closes on outside click or Escape */
const Popover = ({ anchor, placement = 'bottom-start', offset = 8, onClose, className, children }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(ref, onClose)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  // Nudge the popover back inside the viewport once it has a size
  const measure = useCallback((el: HTMLDivElement | null) => {
    ref.current = el
    if (!el) return
    const rect = el.getBoundingClientRect()
    const shift = (start: number, size: number, viewport: number) => {
      if (size > viewport - MARGIN * 2) return MARGIN - start // too big: pin to the start edge
      if (start + size > viewport - MARGIN) return viewport - MARGIN - (start + size)
      if (start < MARGIN) return MARGIN - start
      return 0
    }
    const dx = shift(rect.left, rect.width, window.innerWidth)
    const dy = shift(rect.top, rect.height, window.innerHeight)
    if (dx) el.style.left = `${parseFloat(el.style.left) + dx}px`
    if (dy) el.style.top = `${parseFloat(el.style.top) + dy}px`
  }, [])

  return createPortal(
    <div
      ref={measure}
      className={classNames(styles.popover, className)}
      style={initialPosition(anchor, placement, offset)}
      onMouseDown={e => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  )
}

export default Popover
