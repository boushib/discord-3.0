'use client'

import { useSelector } from '../../hooks'
import type { Server } from '../../models'
import Member from './Member'
import styles from './Members.module.sass'

const Members = ({ server }: { server: Server }) => {
  const users = useSelector(s => s.users.byId)
  const online = server.members.filter(m => users[m.userId]?.status !== 'offline')
  const offline = server.members.filter(m => users[m.userId]?.status === 'offline')

  return (
    <aside className={styles.members}>
      <div className={styles.members__label}>Online — {online.length}</div>
      <div className={styles.members__team}>
        {online.map(m => (
          <Member key={m.userId} user={users[m.userId]} />
        ))}
      </div>
      <div className={styles.members__label}>Offline — {offline.length}</div>
      {offline.map(m => (
        <Member key={m.userId} user={users[m.userId]} />
      ))}
    </aside>
  )
}

export default Members
