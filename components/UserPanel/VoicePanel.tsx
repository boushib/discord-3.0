'use client'

import { PhoneOff, Signal } from 'lucide-react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { leaveVoice, setVoice } from '../../store'
import Tooltip from '../Tooltip'
import styles from './UserPanel.module.sass'

const VoicePanel = () => {
  const dispatch = useAppDispatch()
  const voice = useSelector(s => s.ui.voice)
  const server = useSelector(s => (voice ? s.servers.byId[voice.serverId] : undefined))
  const channel = server?.channels.find(c => c.id === voice?.channelId)
  if (!voice || !server || !channel) return null

  return (
    <section className={styles.voice} aria-label="Voice connection">
      <Signal size={20} className={styles.voiceSignal} />
      <div className={styles.voiceInfo}>
        <div className={styles.voiceStatus}>Voice Connected</div>
        <div className={styles.voiceChannel}>
          {channel.name} / {server.name}
        </div>
      </div>
      <Tooltip label="Disconnect">
        <button
          type="button"
          className={styles.action}
          aria-label="Disconnect"
          onClick={() => {
            dispatch(leaveVoice(CURRENT_USER_ID))
            dispatch(setVoice(null))
          }}
        >
          <PhoneOff size={20} />
        </button>
      </Tooltip>
    </section>
  )
}

export default VoicePanel
