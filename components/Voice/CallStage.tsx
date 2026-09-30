'use client'

import classNames from 'classnames'
import { Mic, MicOff, PhoneOff, ScreenShare, ScreenShareOff, Video, VideoOff, X } from 'lucide-react'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import type { Server, User } from '../../models'
import { toggleMute } from '../../store'
import { displayNameIn } from '../../store/selectors'
import Tooltip from '../Tooltip'
import { useMedia } from './MediaProvider'
import { useSimulatedSpeaking } from './useSimulatedSpeaking'
import VideoTile from './VideoTile'
import styles from './Voice.module.sass'

interface Props {
  participants: User[]
  server?: Server
  compact?: boolean
}

type Tile = { key: string; user: User; kind: 'camera' | 'screen'; stream: MediaStream | null }

const ControlButton = ({
  label,
  active,
  danger,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  danger?: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <Tooltip label={label}>
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={classNames(styles.control, active && styles.controlActive, danger && styles.controlDanger)}
      onClick={onClick}
    >
      {children}
    </button>
  </Tooltip>
)

/** Participant tiles plus call controls, shared by voice channels and DM calls */
const CallStage = ({ participants, server, compact }: Props) => {
  const dispatch = useAppDispatch()
  const media = useMedia()
  const muted = useSelector(s => s.prefs.muted)
  const [chosen, setChosen] = useState<string | null>(null)
  const others = participants.filter(u => u.id !== CURRENT_USER_ID).map(u => u.id)
  const speaking = useSimulatedSpeaking(others, true)

  const tiles: Tile[] = participants.flatMap(user => {
    const isMe = user.id === CURRENT_USER_ID
    const list: Tile[] = [{ key: `${user.id}-camera`, user, kind: 'camera', stream: isMe ? media.camera : null }]
    if (isMe && media.screen) list.unshift({ key: `${user.id}-screen`, user, kind: 'screen', stream: media.screen })
    return list
  })

  // Spotlight the tile the user picked, or a screen share by default
  const focusedKey =
    (chosen && tiles.some(t => t.key === chosen) ? chosen : null) ??
    (media.screen && chosen !== 'grid' ? `${CURRENT_USER_ID}-screen` : null)
  const focused = tiles.find(t => t.key === focusedKey)

  const renderTile = (tile: Tile) => (
    <VideoTile
      key={tile.key}
      user={tile.user}
      name={displayNameIn(server, tile.user)}
      stream={tile.stream}
      kind={tile.kind}
      speaking={
        tile.kind === 'camera' &&
        (tile.user.id === CURRENT_USER_ID ? media.speaking : speaking.includes(tile.user.id))
      }
      muted={tile.user.id === CURRENT_USER_ID && muted}
      focused={tile.key === focusedKey}
      onClick={() => setChosen(tile.key === focusedKey ? 'grid' : tile.key)}
    />
  )

  return (
    <div className={classNames(styles.stage, compact && styles.stageCompact)}>
      {media.error && (
        <div className={styles.error} role="alert">
          <span>{media.error}</span>
          <button type="button" aria-label="Dismiss" onClick={media.clearError}>
            <X size={16} />
          </button>
        </div>
      )}

      {focused ? (
        <div className={styles.spotlight}>
          <div className={styles.spotlightMain}>{renderTile(focused)}</div>
          <div className={styles.strip}>{tiles.filter(t => t !== focused).map(renderTile)}</div>
        </div>
      ) : (
        <div className={styles.grid} data-count={Math.min(tiles.length, 9)}>
          {tiles.map(renderTile)}
        </div>
      )}

      <div className={styles.controls}>
        <ControlButton
          label={media.camera ? 'Turn Off Camera' : 'Turn On Camera'}
          active={!!media.camera}
          onClick={media.toggleCamera}
        >
          {media.camera ? <Video size={22} /> : <VideoOff size={22} />}
        </ControlButton>
        <ControlButton
          label={media.screen ? 'Stop Streaming' : 'Share Your Screen'}
          active={!!media.screen}
          onClick={media.toggleScreen}
        >
          {media.screen ? <ScreenShareOff size={22} /> : <ScreenShare size={22} />}
        </ControlButton>
        <ControlButton label={muted ? 'Unmute' : 'Mute'} active={!muted} onClick={() => dispatch(toggleMute())}>
          {muted ? <MicOff size={22} /> : <Mic size={22} />}
        </ControlButton>
        <ControlButton label="Disconnect" danger onClick={media.disconnect}>
          <PhoneOff size={22} />
        </ControlButton>
      </div>
    </div>
  )
}

export default CallStage
