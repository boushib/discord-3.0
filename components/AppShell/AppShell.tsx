'use client'

import { useIsClient } from '../../hooks'
import Sidebar from '../Sidebar'
import LoadingScreen from './LoadingScreen'

/**
 * All chat data lives in the client store (persisted to localStorage), so the
 * app renders a loading screen on the server and mounts the UI on the client.
 */
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient()
  if (!isClient) return <LoadingScreen />

  return (
    <div className="app">
      <Sidebar />
      {children}
    </div>
  )
}

export default AppShell
