'use client'

import classNames from 'classnames'
import { PhoneOff, ScreenShare, Signal, Video } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from '../../hooks'
import { channelHref, dmHref, ME } from '../../lib/routes'
import Tooltip from '../Tooltip'
import { useMedia } from '../Voice'
import styles from './UserPanel.module.sass'

const VoicePanel = () => {
  const media = useMedia()
  const voice = useSelector(s => s.ui.voice)
  const label = useSelector(s => {
    if (!voice) return null
    if (voice.serverId === ME) {
      const dm = s.dms.find(d => d.id === voice.channelId)
      return dm ? `Call with ${s.users.byId[dm.recipientId].displayName}` : null
    }
    const server = s.servers.byId[voice.serverId]
    const channel = server?.channels.find(c => c.id === voice.channelId)
    return server && channel ? `${channel.name} / ${server.name}` : null
  })
  if (!voice || !label) return null
  const href = voice.serverId === ME ? dmHref(voice.channelId) : channelHref(voice.serverId, voice.channelId)

  return (
    <section className={styles.voice} aria-label="Voice connection">
      <div className={styles.voiceRow}>
        <Signal size={20} className={styles.voiceSignal} />
        <Link href={href} className={styles.voiceInfo}>
          <div className={styles.voiceStatus}>{media.screen ? 'Streaming' : 'Voice Connected'}</div>
          <div className={styles.voiceChannel}>{label}</div>
        </Link>
        <Tooltip label="Disconnect">
          <button type="button" className={styles.action} aria-label="Disconnect" onClick={media.disconnect}>
            <PhoneOff size={20} />
          </button>
        </Tooltip>
      </div>
      <div className={styles.voiceButtons}>
        <button
          type="button"
          className={classNames(styles.voiceButton, media.camera && styles.voiceButtonOn)}
          onClick={media.toggleCamera}
        >
          <Video size={18} /> {media.camera ? 'Stop Video' : 'Video'}
        </button>
        <button
          type="button"
          className={classNames(styles.voiceButton, media.screen && styles.voiceButtonOn)}
          onClick={media.toggleScreen}
        >
          <ScreenShare size={18} /> {media.screen ? 'Stop' : 'Screen'}
        </button>
      </div>
    </section>
  )
}

export default VoicePanel
