import ChannelIcon from '../../icons/Channel'
import VerifiedIcon from '../../icons/Verified'
import styles from './Server.module.sass'

const CHANNELS = [
  '📣 Announcements',
  '⚡ Challenges',
  '⚡ Challenges updates',
  '🌵 General',
  '🏢 Office hours',
  '🏀 NBA',
  '💎 WNBA',
]

const Server = () => (
  <div className={styles.server}>
    <div className={styles.server__sidebar}>
      <div className={styles.server__sidebar__name}>
        <VerifiedIcon /> NBA Top Shot
      </div>
      {CHANNELS.map(c => (
        <div className={styles.server__sidebar__channel__wrapper} key={c}>
          <div className={styles.server__sidebar__channel} key={c}>
            <ChannelIcon />
            {c}
          </div>
        </div>
      ))}
    </div>
    <div className={styles.server__main}>Server</div>
  </div>
)

export default Server
