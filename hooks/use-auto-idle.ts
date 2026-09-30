import { useEffect } from 'react'
import { useStore } from 'react-redux'
import { CURRENT_USER_ID } from '../constants'
import type { RootState } from '../store'
import { setAutoIdle, setStatus } from '../store'
import { useAppDispatch } from './use-selector'

const IDLE_AFTER = 10 * 60 * 1000
const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'] as const

/** Like Discord: Online becomes Idle after 10 minutes without activity */
export const useAutoIdle = () => {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const goIdle = () => {
      const state = store.getState()
      if (state.users.byId[CURRENT_USER_ID].status !== 'online') return
      dispatch(setStatus('idle'))
      dispatch(setAutoIdle(true))
    }

    const onActivity = () => {
      if (store.getState().ui.autoIdle) {
        dispatch(setStatus('online'))
        dispatch(setAutoIdle(false))
      }
      clearTimeout(timer)
      timer = setTimeout(goIdle, IDLE_AFTER)
    }

    onActivity()
    EVENTS.forEach(e => window.addEventListener(e, onActivity, { passive: true }))
    return () => {
      clearTimeout(timer)
      EVENTS.forEach(e => window.removeEventListener(e, onActivity))
    }
  }, [dispatch, store])
}
