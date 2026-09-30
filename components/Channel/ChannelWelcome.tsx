import { useSelector } from '../../hooks'
import ChannelIcon from '../../icons/Channel'
import type { ChannelContext } from '../../store/selectors'
import Avatar from '../Avatar'
import styles from './Channel.module.sass'

const ChannelWelcome = ({ context }: { context: ChannelContext }) => {
  const relationship = useSelector(s =>
    context.kind === 'dm' ? s.users.relationships.find(r => r.userId === context.recipient.id) : undefined
  )

  if (context.kind === 'dm') {
    const { recipient } = context
    return (
      <div className={styles.welcome}>
        <Avatar user={recipient} size={80} />
        <h1 className={styles.welcomeTitle}>{recipient.displayName}</h1>
        <div className={styles.welcomeUsername}>{recipient.username}</div>
        <p className={styles.welcomeText}>
          This is the beginning of your direct message history with <strong>{recipient.displayName}</strong>.
        </p>
        {relationship?.type === 'friend' && <div className={styles.welcomeTag}>You’re friends</div>}
      </div>
    )
  }

  const { channel } = context
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeIcon}>
        <ChannelIcon width={42} height={42} />
      </div>
      <h1 className={styles.welcomeTitle}>Welcome to #{channel.name}!</h1>
      <p className={styles.welcomeText}>This is the start of the #{channel.name} channel.</p>
    </div>
  )
}

export default ChannelWelcome
