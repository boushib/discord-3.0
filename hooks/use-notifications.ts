import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useStore } from 'react-redux'
import { CURRENT_USER_ID } from '../constants'
import { playPing } from '../lib/sounds'
import type { RootState } from '../store'
import { findChannel, isMention } from '../store/selectors'

/**
 * Pings for DMs and @mentions that arrive outside the channel you're looking
 * at, and shows a desktop notification while the tab is in the background.
 */
export const useNotifications = () => {
  const store = useStore<RootState>()
  const pathname = usePathname()
  const pathRef = useRef(pathname)

  useEffect(() => {
    pathRef.current = pathname
  }, [pathname])

  useEffect(() => {
    let previous = store.getState().messages

    return store.subscribe(() => {
      const state = store.getState()
      const current = state.messages
      if (current === previous) return
      const before = previous
      previous = current

      const me = state.users.byId[CURRENT_USER_ID]
      if (me.status === 'dnd') return

      for (const [channelId, list] of Object.entries(current)) {
        const old = before[channelId] ?? []
        if (list === old || list.length <= old.length) continue
        const context = findChannel(state, channelId)
        if (!context) continue
        const level = state.prefs.notifications[channelId] ?? 'all'
        if (level === 'none') continue

        for (const message of list.slice(old.length)) {
          if (message.authorId === CURRENT_USER_ID) continue
          const important = context.kind === 'dm' || isMention(state, message)
          if (!important) continue
          const viewing = pathRef.current.endsWith(`/${channelId}`) || state.ui.openThreadId === channelId
          if (viewing && document.visibilityState === 'visible') continue

          if (state.prefs.notificationSounds) playPing()
          if (
            state.prefs.desktopNotifications &&
            document.visibilityState === 'hidden' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            const author = state.users.byId[message.authorId]
            const where = context.kind === 'dm' ? '' : ` (#${context.channel.name}, ${context.server.name})`
            new Notification(`${author?.displayName ?? 'Someone'}${where}`, {
              body: message.content || 'Sent an attachment',
              tag: message.id,
            })
          }
        }
      }
    })
  }, [store])
}
