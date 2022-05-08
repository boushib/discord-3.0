import ChatItem from '../ChatItem/ChatItem'
import styles from './Channel.module.sass'

const CHAT_MESSAGES = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
]

const ChannelBody = () => (
  <div className={styles.channel__body}>
    {CHAT_MESSAGES.map(m => (
      <ChatItem key={m.id} />
    ))}
  </div>
)

export default ChannelBody
