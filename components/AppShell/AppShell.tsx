'use client'

import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch, useGlobalShortcuts, useIsClient, useSelector } from '../../hooks'
import { setMobileNav } from '../../store'
import ModalRoot from '../Modals'
import ServerRail from '../ServerRail'
import { MediaProvider } from '../Voice'
import LoadingScreen from './LoadingScreen'

/**
 * All chat data lives in the client store (persisted to localStorage), so the
 * app renders a loading screen on the server and mounts the UI on the client.
 */
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient()
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const mobileNavOpen = useSelector(s => s.ui.mobileNavOpen)
  const theme = useSelector(s => s.prefs.theme)
  useGlobalShortcuts()

  // On phones, picking a destination closes the navigation drawer
  useEffect(() => {
    dispatch(setMobileNav(false))
  }, [dispatch, pathname])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  if (!isClient) return <LoadingScreen />

  return (
    <MediaProvider>
      <div className={classNames('app', mobileNavOpen && 'app--nav-open')}>
        <ServerRail />
        {children}
        <ModalRoot />
      </div>
    </MediaProvider>
  )
}

export default AppShell
