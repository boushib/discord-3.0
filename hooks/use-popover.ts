import { useCallback, useState } from 'react'

/** Anchor state for a Popover plus props for the element that toggles it */
export const usePopover = () => {
  const [anchor, setAnchor] = useState<DOMRect | null>(null)
  const close = useCallback(() => setAnchor(null), [])
  const openAt = useCallback((el: Element) => setAnchor(el.getBoundingClientRect()), [])

  const triggerProps = {
    'aria-expanded': anchor !== null,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setAnchor(current => (current ? null : rect))
    },
    // Keep the outside-click handler from closing and the click from reopening
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  }

  return { anchor, close, openAt, triggerProps }
}
