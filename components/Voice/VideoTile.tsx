'use client'

import classNames from 'classnames'
import { MicOff, MonitorUp } from 'lucide-react'
import { AVATAR_COLORS } from '../../constants'
import type { User } from '../../models'
import Avatar from '../Avatar'
import styles from './Voice.module.sass'

interface Props {
  user: User
  name: string
  stream?: MediaStream | null
  kind?: 'camera' | 'screen'
  speaking?: boolean
  muted?: boolean
  focused?: boolean
  onClick?: () => void
}

const attach = (stream: MediaStream | null | undefined) => (el: HTMLVideoElement | null) => {
  if (el && stream && el.srcObject !== stream) el.srcObject = stream
}

const VideoTile = ({ user, name, stream, kind = 'camera', speaking, muted, focused, onClick }: Props) => (
  <button
    type="button"
    className={classNames(styles.tile, speaking && styles.speaking, focused && styles.focused)}
    style={{ '--tile-color': user.bannerColor ?? AVATAR_COLORS[user.avatarColor] } as React.CSSProperties}
    onClick={onClick}
    aria-label={kind === 'screen' ? `${name}'s screen` : name}
  >
    {stream ? (
      <video
        ref={attach(stream)}
        className={classNames(styles.video, kind === 'camera' && styles.mirrored, kind === 'screen' && styles.contain)}
        autoPlay
        playsInline
        muted
      />
    ) : (
      <span className={styles.tileAvatar}>
        <Avatar user={user} size={80} />
      </span>
    )}
    {kind === 'screen' && (
      <span className={styles.live}>
        <MonitorUp size={12} /> LIVE
      </span>
    )}
    <span className={styles.tileName}>
      {muted && <MicOff size={14} className={styles.tileMuted} />}
      {kind === 'screen' ? `${name}’s screen` : name}
    </span>
  </button>
)

export default VideoTile
