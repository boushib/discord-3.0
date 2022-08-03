import classNames from 'classnames'
import { useSelector } from '../../hooks'
import ChannelIcon from '../../icons/Channel'
import VerifiedIcon from '../../icons/Verified'
import Channel from '../Channel'
import Members from '../Members'
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

const Server = () => {
  const { currentServer } = useSelector(s => s.servers)
  return (
    <div className={styles.server}>
      <div className={styles.server__sidebar}>
        <div className={styles.server__sidebar__name}>
          <VerifiedIcon /> {currentServer.name}
        </div>
        {CHANNELS.map((c, i) => (
          <div className={styles.server__sidebar__channel__wrapper} key={c}>
            <div
              className={classNames({
                [styles.server__sidebar__channel]: true,
                [styles['server__sidebar__channel--active']]: i === 3,
              })}
              key={c}
            >
              <ChannelIcon />
              {c}
            </div>
          </div>
        ))}
      </div>
      <Channel />
      <Members />
    </div>
  )
}

export default Server
