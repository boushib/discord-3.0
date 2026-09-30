import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  const timer = setInterval(callback, 30_000)
  return () => clearInterval(timer)
}

/** Current time rounded to the minute; re-renders about every 30 seconds */
export const useNow = () =>
  useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0
  )
