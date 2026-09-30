'use client'

import classNames from 'classnames'
import { Copy, Headphones, HeadphoneOff, Mic, MicOff, Pencil, Settings } from 'lucide-react'
import { STATUS_LABELS } from '../../constants'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import type { PresenceStatus } from '../../models'
import { openModal, setStatus, toggleDeafen, toggleMute } from '../../store'
import { selectCurrentUser } from '../../store/selectors'
import Avatar from '../Avatar'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import Tooltip from '../Tooltip'
import styles from './UserPanel.module.sass'

const STATUSES: PresenceStatus[] = ['online', 'idle', 'dnd', 'offline']
const STATUS_HINTS: Partial<Record<PresenceStatus, string>> = {
  dnd: 'You will not receive desktop notifications',
  offline: 'You will appear offline',
}

const UserPanel = () => {
  const dispatch = useAppDispatch()
  const me = useSelector(selectCurrentUser)
  const { muted, deafened } = useSelector(s => s.prefs)
  const { anchor, close, triggerProps } = usePopover()

  return (
    <section className={styles.panel} aria-label="User area">
      <button type="button" className={styles.user} {...triggerProps}>
        <Avatar user={me} size={32} status={me.status} ringColor="var(--bg-secondary-alt)" />
        <span className={styles.names}>
          <span className={styles.displayName}>{me.displayName}</span>
          <span className={styles.subtext}>
            <span className={styles.statusText}>{me.customStatus || STATUS_LABELS[me.status]}</span>
            <span className={styles.username}>{me.username}</span>
          </span>
        </span>
      </button>

      <Tooltip label={muted ? 'Unmute' : 'Mute'}>
        <button
          type="button"
          className={classNames(styles.action, muted && styles.actionOff)}
          onClick={() => dispatch(toggleMute())}
          aria-pressed={muted}
          aria-label="Mute"
        >
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </Tooltip>
      <Tooltip label={deafened ? 'Undeafen' : 'Deafen'}>
        <button
          type="button"
          className={classNames(styles.action, deafened && styles.actionOff)}
          onClick={() => dispatch(toggleDeafen())}
          aria-pressed={deafened}
          aria-label="Deafen"
        >
          {deafened ? <HeadphoneOff size={20} /> : <Headphones size={20} />}
        </button>
      </Tooltip>
      <Tooltip label="User Settings">
        <button
          type="button"
          className={styles.action}
          onClick={() => dispatch(openModal({ type: 'settings' }))}
          aria-label="User Settings"
        >
          <Settings size={20} />
        </button>
      </Tooltip>

      {anchor && (
        <Popover anchor={anchor} placement="top-start" offset={12} onClose={close}>
          <div className={styles.card}>
            <div className={styles.banner} style={{ backgroundColor: me.bannerColor ?? 'var(--brand)' }} />
            <div className={styles.cardAvatar}>
              <Avatar user={me} size={80} status={me.status} ringColor="var(--bg-floating)" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardName}>{me.displayName}</div>
              <div className={styles.cardUsername}>{me.username}</div>
              <Menu className={styles.cardMenu}>
                {STATUSES.map(status => (
                  <MenuItem
                    key={status}
                    label={STATUS_LABELS[status]}
                    hint={STATUS_HINTS[status]}
                    icon={<span className={classNames(styles.dot, styles[status])} />}
                    onClick={() => {
                      dispatch(setStatus(status))
                      close()
                    }}
                  />
                ))}
                <MenuSeparator />
                <MenuItem
                  label="Edit Profile"
                  icon={<Pencil size={16} />}
                  onClick={() => {
                    close()
                    dispatch(openModal({ type: 'settings' }))
                  }}
                />
                <MenuItem
                  label="Copy User ID"
                  icon={<Copy size={16} />}
                  onClick={() => {
                    navigator.clipboard?.writeText(me.id)
                    close()
                  }}
                />
              </Menu>
            </div>
          </div>
        </Popover>
      )}
    </section>
  )
}

export default UserPanel
