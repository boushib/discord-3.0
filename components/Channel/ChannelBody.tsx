'use client'

import { useSelector } from '../../hooks'
import { selectMessages } from '../../store/selectors'
import ChatItem from '../ChatItem'
import styles from './Channel.module.sass'

const ChannelBody = ({ channelId }: { channelId: string }) => {
  const messages = useSelector(s => selectMessages(s, channelId))
  return (
    <div className={styles.channel__body}>
      {messages.map(m => (
        <ChatItem key={m.id} message={m} />
      ))}
    </div>
  )
}

export default ChannelBody
