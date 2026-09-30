'use client'

import { useGlobalShortcuts, useIsClient } from '../../hooks'
import ModalRoot from '../Modals'
import ServerRail from '../ServerRail'
import LoadingScreen from './LoadingScreen'

/**
 * All chat data lives in the client store (persisted to localStorage), so the
 * app renders a loading screen on the server and mounts the UI on the client.
 */
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient()
  useGlobalShortcuts()
  if (!isClient) return <LoadingScreen />

  return (
    <div className="app">
      <ServerRail />
      {children}
      <ModalRoot />
    </div>
  )
}

export default AppShell
