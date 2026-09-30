import { useCallback, useEffect, useRef, useState } from 'react'

const THRESHOLD = 0.035 // RMS level that counts as talking
const HOLD_MS = 300 // keep the ring lit briefly between words

interface Session {
  stream: MediaStream
  context: AudioContext
  frame: number
}

/**
 * Captures the microphone and reports whether you're talking, using a Web
 * Audio analyser. Audio is only measured locally, never recorded or sent.
 */
export const useMicrophone = (muted: boolean, onError: (message: string) => void) => {
  const [speaking, setSpeaking] = useState(false)
  const session = useRef<Session | null>(null)

  const stop = useCallback(() => {
    const current = session.current
    if (!current) return
    cancelAnimationFrame(current.frame)
    current.stream.getTracks().forEach(t => t.stop())
    void current.context.close()
    session.current = null
    setSpeaking(false)
  }, [])

  const start = useCallback(async () => {
    if (session.current || !navigator.mediaDevices?.getUserMedia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 512
      context.createMediaStreamSource(stream).connect(analyser)
      const samples = new Uint8Array(analyser.fftSize)
      let lastLoud = 0
      let wasSpeaking = false

      const tick = () => {
        analyser.getByteTimeDomainData(samples)
        let sum = 0
        for (const v of samples) sum += ((v - 128) / 128) ** 2
        const now = performance.now()
        if (Math.sqrt(sum / samples.length) > THRESHOLD) lastLoud = now
        const isSpeaking = now - lastLoud < HOLD_MS
        if (isSpeaking !== wasSpeaking) {
          wasSpeaking = isSpeaking
          setSpeaking(isSpeaking)
        }
        if (session.current) session.current.frame = requestAnimationFrame(tick)
      }

      session.current = { stream, context, frame: 0 }
      session.current.frame = requestAnimationFrame(tick)
    } catch (e) {
      const denied = e instanceof DOMException && e.name === 'NotAllowedError'
      onError(denied ? 'Microphone access was denied, so your speaking indicator won’t light up.' : 'No microphone was found.')
    }
  }, [onError])

  // Muting disables the track instead of tearing the session down
  useEffect(() => {
    session.current?.stream.getAudioTracks().forEach(t => (t.enabled = !muted))
  }, [muted])

  useEffect(() => stop, [stop])

  return { speaking: speaking && !muted, start, stop }
}
