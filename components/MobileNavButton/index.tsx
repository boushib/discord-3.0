'use client'

import { Menu } from 'lucide-react'
import { useAppDispatch } from '../../hooks'
import { setMobileNav } from '../../store'

/** Hamburger shown only on phones to open the servers/channels drawer */
const MobileNavButton = () => {
  const dispatch = useAppDispatch()
  return (
    <button
      type="button"
      className="mobile-nav-button"
      aria-label="Open navigation"
      onClick={() => dispatch(setMobileNav(true))}
    >
      <Menu size={22} />
    </button>
  )
}

export default MobileNavButton
