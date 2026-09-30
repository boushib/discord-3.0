'use client'

import { Volume2 } from 'lucide-react'
import { useSelector } from '../../hooks'
import Avatar from '../Avatar'
import styles from './Friends.module.sass'

/** Friends currently hanging out in a voice channel */
const ActiveNow = () => {
  const servers = useSelector(s => s.servers)
  const users = useSelector(s => s.users.byId)
  const friendIds = useSelector(s => s.users.relationships)
    .filter(r => r.type === 'friend')
    .map(r => r.userId)

  const activity = friendIds.flatMap(userId => {
    for (const serverId of servers.order) {
      const server = servers.byId[serverId]
      for (const [channelId, members] of Object.entries(server.voiceStates)) {
        if (members.includes(userId)) {
          const channel = server.channels.find(c => c.id === channelId)
          if (channel) return [{ user: users[userId], server, channel, members }]
        }
      }
    }
    return []
  })

  return (
    <aside className={styles.activeNow}>
      <h2 className={styles.activeTitle}>Active Now</h2>
      {activity.length === 0 ? (
        <div className={styles.activeEmpty}>
          <h3>It’s quiet for now…</h3>
          <p>When a friend starts an activity—like playing a game or hanging out on voice—we’ll show it here!</p>
        </div>
      ) : (
        activity.map(({ user, server, channel, members }) => (
          <div key={user.id} className={styles.activeCard}>
            <div className={styles.activeHeader}>
              <Avatar user={user} size={40} status={user.status} ringColor="var(--bg-secondary)" />
              <div>
                <div className={styles.activeName}>{user.displayName}</div>
                <div className={styles.activeWhere}>{server.name}</div>
              </div>
            </div>
            <div className={styles.activeVoice}>
              <Volume2 size={16} />
              <span>{channel.name}</span>
              <span className={styles.activeAvatars}>
                {members.slice(0, 4).map(id => (
                  <Avatar key={id} user={users[id]} size={20} />
                ))}
              </span>
            </div>
          </div>
        ))
      )}
    </aside>
  )
}

export default ActiveNow
