'use client'

import { BellOff, Bell } from 'lucide-react'
import { useAppDispatch, useSelector } from '../../hooks'
import { setNotificationLevel, toggleChannelMute, type NotificationLevel } from '../../store'
import { Menu, MenuItem, MenuSeparator } from '../Popover'

const LEVELS: { level: NotificationLevel; label: string }[] = [
  { level: 'all', label: 'All Messages' },
  { level: 'mentions', label: 'Only @mentions' },
  { level: 'none', label: 'Nothing' },
]

const NotificationMenu = ({ channelId, onDone }: { channelId: string; onDone: () => void }) => {
  const dispatch = useAppDispatch()
  const muted = useSelector(s => s.prefs.mutedChannels.includes(channelId))
  const level = useSelector(s => s.prefs.notifications[channelId] ?? 'all')

  return (
    <Menu>
      <MenuItem
        label={muted ? 'Unmute Channel' : 'Mute Channel'}
        hint={muted ? undefined : 'Hide unread indicators'}
        icon={muted ? <Bell size={16} /> : <BellOff size={16} />}
        onClick={() => {
          dispatch(toggleChannelMute(channelId))
          onDone()
        }}
      />
      <MenuSeparator />
      {LEVELS.map(l => (
        <MenuItem
          key={l.level}
          label={l.label}
          checked={level === l.level}
          onClick={() => dispatch(setNotificationLevel({ channelId, level: l.level }))}
        />
      ))}
    </Menu>
  )
}

export default NotificationMenu
