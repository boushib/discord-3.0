let context: AudioContext | null = null

/** Discord-like two-tone "ping", synthesized so no audio file is needed */
export const playPing = () => {
  try {
    context ??= new AudioContext()
    const now = context.currentTime
    ;[880, 1320].forEach((frequency, i) => {
      const osc = context!.createOscillator()
      const gain = context!.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency
      const start = now + i * 0.09
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.15, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25)
      osc.connect(gain).connect(context!.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  } catch {
    // Audio unavailable (e.g. autoplay policy before any interaction)
  }
}
