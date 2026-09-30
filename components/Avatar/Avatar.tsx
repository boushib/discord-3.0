'use client'

import classNames from 'classnames'
import { useState } from 'react'
import { AVATAR_COLORS } from '../../constants'
import DiscordIcon from '../../icons/Discord'
import type { PresenceStatus, User } from '../../models'
import styles from './Avatar.module.sass'

interface Props {
  user: Pick<User, 'avatar' | 'avatarColor' | 'displayName'>
  size?: number
  status?: PresenceStatus
  /** Background behind the status dot, so it "cuts out" of the avatar */
  ringColor?: string
  className?: string
}

const Avatar = ({ user, size = 40, status, ringColor = 'var(--bg-secondary)', className }: Props) => {
  const [failed, setFailed] = useState(false)
  const statusSize = Math.max(10, Math.round(size * 0.3))
  const ring = Math.max(3, Math.round(size * 0.075))

  return (
    <div
      className={classNames(styles.avatar, className)}
      style={
        {
          width: size,
          height: size,
          '--status-size': `${statusSize}px`,
          '--ring': ringColor,
          '--ring-width': `${ring}px`,
        } as React.CSSProperties
      }
    >
      {user.avatar && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URLs
        <img
          src={user.avatar}
          alt=""
          className={styles.image}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={styles.fallback}
          style={{ backgroundColor: AVATAR_COLORS[user.avatarColor % AVATAR_COLORS.length] }}
        >
          <DiscordIcon width={size * 0.6} height={size * 0.45} />
        </div>
      )}
      {status && (
        <span className={classNames(styles.status, styles[status])} aria-label={status} />
      )}
    </div>
  )
}

export default Avatar
