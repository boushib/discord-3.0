'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { ME } from '../../lib/routes'
import { joinVoice, leaveVoice, setVoice } from '../../store'
import { useMicrophone } from './useMicrophone'

interface MediaApi {
  camera: MediaStream | null
  screen: MediaStream | null
  /** Whether your microphone currently picks up speech */
  speaking: boolean
  error: string | null
  clearError: () => void
  toggleCamera: () => Promise<void>
  toggleScreen: () => Promise<void>
  join: (serverId: string, channelId: string) => void
  disconnect: () => void
}

const MediaContext = createContext<MediaApi | null>(null)

const stopStream = (stream: MediaStream | null) => stream?.getTracks().forEach(track => track.stop())

const describe = (error: unknown, device: string) => {
  const name = error instanceof DOMException ? error.name : ''
  if (name === 'NotAllowedError') return `Permission to use your ${device} was denied.`
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return `No ${device} was found.`
  if (name === 'AbortError') return null // user closed the picker
  return `Couldn’t start your ${device}.`
}

/**
 * Holds the local camera and screen-share streams. It sits above the router so
 * a call keeps running while you browse text channels, like on Discord.
 */
export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const [camera, setCamera] = useState<MediaStream | null>(null)
  const [screen, setScreen] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const muted = useSelector(s => s.prefs.muted)
  const { speaking, start: startMic, stop: stopMic } = useMicrophone(muted, setError)

  const toggleCamera = useCallback(async () => {
    if (camera) {
      stopStream(camera)
      setCamera(null)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      setCamera(stream)
    } catch (e) {
      setError(describe(e, 'camera'))
    }
  }, [camera])

  const toggleScreen = useCallback(async () => {
    if (screen) {
      stopStream(screen)
      setScreen(null)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false })
      // The browser's own "Stop sharing" button ends the track
      stream.getVideoTracks()[0]?.addEventListener('ended', () => setScreen(null))
      setScreen(stream)
    } catch (e) {
      setError(describe(e, 'screen'))
    }
  }, [screen])

  const join = useCallback(
    (serverId: string, channelId: string) => {
      if (serverId === ME) dispatch(leaveVoice(CURRENT_USER_ID))
      else dispatch(joinVoice({ serverId, channelId, userId: CURRENT_USER_ID }))
      dispatch(setVoice({ serverId, channelId, startedAt: Date.now() }))
      void startMic()
    },
    [dispatch, startMic]
  )

  const disconnect = useCallback(() => {
    stopStream(camera)
    stopStream(screen)
    setCamera(null)
    setScreen(null)
    stopMic()
    dispatch(leaveVoice(CURRENT_USER_ID))
    dispatch(setVoice(null))
  }, [camera, screen, stopMic, dispatch])

  const value = useMemo(
    () => ({
      camera,
      screen,
      speaking,
      error,
      clearError: () => setError(null),
      toggleCamera,
      toggleScreen,
      join,
      disconnect,
    }),
    [camera, screen, speaking, error, toggleCamera, toggleScreen, join, disconnect]
  )

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
}

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (!context) throw new Error('useMedia must be used inside <MediaProvider>')
  return context
}
