'use client'

import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { playPing } from '../../lib/sounds'
import { setDesktopNotifications, setNotificationSounds } from '../../store'
import styles from './Settings.module.sass'

const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) => (
  <label className={styles.toggleRow}>
    <span>
      <span className={styles.toggleLabel}>{label}</span>
      <span className={styles.toggleDescription}>{description}</span>
    </span>
    <input type="checkbox" className={styles.toggle} checked={checked} onChange={e => onChange(e.target.checked)} />
  </label>
)

const NotificationsSection = () => {
  const dispatch = useAppDispatch()
  const sounds = useSelector(s => s.prefs.notificationSounds)
  const desktop = useSelector(s => s.prefs.desktopNotifications)
  const [warning, setWarning] = useState<string | null>(null)

  const toggleDesktop = async (enabled: boolean) => {
    setWarning(null)
    if (!enabled) return dispatch(setDesktopNotifications(false))
    if (!('Notification' in window)) return setWarning('This browser doesn’t support desktop notifications.')
    const permission =
      Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission
    if (permission === 'granted') dispatch(setDesktopNotifications(true))
    else setWarning('Notifications are blocked for this site. Allow them in your browser’s site settings.')
  }

  return (
    <>
      <h1 className={styles.title}>Notifications</h1>
      <Toggle
        label="Enable Desktop Notifications"
        description="Show a system notification for DMs and @mentions while this tab is in the background."
        checked={desktop}
        onChange={toggleDesktop}
      />
      {warning && <p className={styles.warning}>{warning}</p>}
      <Toggle
        label="Notification Sounds"
        description="Play a ping for DMs and @mentions outside the channel you’re viewing."
        checked={sounds}
        onChange={enabled => {
          dispatch(setNotificationSounds(enabled))
          if (enabled) playPing()
        }}
      />
      <p className={styles.toggleDescription}>
        Do Not Disturb silences everything, and muted channels or channels set to “Nothing” never notify.
      </p>
    </>
  )
}

export default NotificationsSection
