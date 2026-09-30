import { useEffect } from 'react'
import { closeModal, openModal, toggleDeafen, toggleMute } from '../store'
import { useAppDispatch, useSelector } from './use-selector'

/** Discord's desktop shortcuts: ⌘/Ctrl+K switcher, ⌘/Ctrl+/ help, ⌘/Ctrl+Shift+M mute, ⌘/Ctrl+Shift+D deafen */
export const useGlobalShortcuts = () => {
  const dispatch = useAppDispatch()
  const modal = useSelector(s => s.ui.modal)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const key = e.key.toLowerCase()
      if (key === 'k' && !e.shiftKey) {
        e.preventDefault()
        dispatch(modal?.type === 'quickSwitcher' ? closeModal() : openModal({ type: 'quickSwitcher' }))
      } else if (key === '/') {
        e.preventDefault()
        dispatch(modal?.type === 'shortcuts' ? closeModal() : openModal({ type: 'shortcuts' }))
      } else if (key === 'm' && e.shiftKey) {
        e.preventDefault()
        dispatch(toggleMute())
      } else if (key === 'd' && e.shiftKey) {
        e.preventDefault()
        dispatch(toggleDeafen())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, modal])
}
