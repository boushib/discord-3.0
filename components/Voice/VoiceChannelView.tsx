'use client'

import { Volume2 } from 'lucide-react'
import { useSelector } from '../../hooks'
import type { Channel, Server } from '../../models'
import Avatar from '../Avatar'
import { Button } from '../Modal'
import MobileNavButton from '../MobileNavButton'
import CallStage from './CallStage'
import { useMedia } from './MediaProvider'
import styles from './Voice.module.sass'

const VoiceChannelView = ({ server, channel }: { server: Server; channel: Channel }) => {
  const media = useMedia()
  const users = useSelector(s => s.users.byId)
  const connected = useSelector(s => s.ui.voice?.channelId === channel.id)
  const participants = (server.voiceStates[channel.id] ?? []).map(id => users[id]).filter(Boolean)

  return (
    <div className={styles.voiceView}>
      <header className={styles.voiceHeader}>
        <MobileNavButton />
        <Volume2 size={22} />
        <h1>{channel.name}</h1>
      </header>
      {connected ? (
        <CallStage participants={participants} server={server} />
      ) : (
        <div className={styles.lobby}>
          <div className={styles.lobbyAvatars}>
            {participants.slice(0, 5).map(u => (
              <Avatar key={u.id} user={u} size={56} />
            ))}
          </div>
          <h2>{channel.name}</h2>
          <p>
            {participants.length
              ? `${participants.map(u => u.displayName).join(', ')} ${participants.length === 1 ? 'is' : 'are'} in voice`
              : 'No one is currently in voice'}
          </p>
          <Button variant="success" onClick={() => media.join(server.id, channel.id)}>
            Join Voice
          </Button>
        </div>
      )}
    </div>
  )
}

export default VoiceChannelView
