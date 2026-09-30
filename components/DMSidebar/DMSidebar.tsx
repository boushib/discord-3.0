'use client'

import Link from 'next/link'
import { useSelector } from '../../hooks'
import { dmHref } from '../../lib/routes'
import Avatar from '../Avatar'
import UserPanel from '../UserPanel'
import styles from './DMSidebar.module.sass'

const DMSidebar = () => {
  const dms = useSelector(s => s.dms)
  const users = useSelector(s => s.users.byId)
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>Direct Messages</div>
      {dms.map(dm => (
        <Link key={dm.id} href={dmHref(dm.id)} className={styles.dm}>
          <Avatar user={users[dm.recipientId]} size={32} status={users[dm.recipientId].status} />
          {users[dm.recipientId].displayName}
        </Link>
      ))}
      <div style={{ flex: 1 }} />
      <UserPanel />
    </div>
  )
}

export default DMSidebar
