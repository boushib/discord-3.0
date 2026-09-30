'use client'

import classNames from 'classnames'
import { Crown } from 'lucide-react'
import type { Server, User } from '../../models'
import { displayNameIn, roleColorIn } from '../../store/selectors'
import Avatar from '../Avatar'
import { ProfileTrigger } from '../Profile'
import Tooltip from '../Tooltip'
import styles from './Member.module.sass'

interface Props {
  user: User
  server: Server
  offline: boolean
}

const Member = ({ user, server, offline }: Props) => (
  <ProfileTrigger
    userId={user.id}
    server={server}
    placement="left-start"
    className={classNames(styles.member, offline && styles.offline)}
  >
    <Avatar user={user} size={32} status={offline ? undefined : user.status} ringColor="var(--bg-secondary)" />
    <span className={styles.info}>
      <span className={styles.nameRow}>
        <span className={styles.name} style={{ color: offline ? undefined : roleColorIn(server, user.id) }}>
          {displayNameIn(server, user)}
        </span>
        {server.ownerId === user.id && (
          <Tooltip label="Server Owner">
            <Crown size={14} className={styles.crown} />
          </Tooltip>
        )}
        {user.bot && <span className={styles.botTag}>✓ BOT</span>}
      </span>
      {!offline && user.customStatus && <span className={styles.status}>{user.customStatus}</span>}
    </span>
  </ProfileTrigger>
)

export default Member
