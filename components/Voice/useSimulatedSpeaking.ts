import { useEffect, useState } from 'react'

/** Randomly lights up the speaking ring for other call participants */
export const useSimulatedSpeaking = (userIds: string[], enabled: boolean) => {
  const [speaking, setSpeaking] = useState<string[]>([])
  const key = userIds.join(',')

  useEffect(() => {
    if (!enabled || !key) return
    const ids = key.split(',')
    const timer = setInterval(() => {
      setSpeaking(ids.filter(() => Math.random() < 0.3))
    }, 900)
    return () => clearInterval(timer)
  }, [key, enabled])

  return enabled ? speaking : []
}
