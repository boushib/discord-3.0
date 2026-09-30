'use client'

import { CURRENT_USER_ID } from '../../constants'
import { useSelector } from '../../hooks'
import type { GroupDM } from '../../models'
import Avatar from '../Avatar'
import { ProfileTrigger } from '../Profile'
import styles from './Members.module.sass'
import memberStyles from './Member.module.sass'

const GroupMembers = ({ group }: { group: GroupDM }) => {
  const users = useSelector(s => s.users.byId)
  const ids = [CURRENT_USER_ID, ...group.memberIds]
  return (
    <aside className={`${styles.members} scroller`} aria-label="Group members">
      <h3 className={styles.label}>Members — {ids.length}</h3>
      {ids.map(id => (
        <ProfileTrigger key={id} userId={id} placement="left-start" className={memberStyles.member}>
          <Avatar user={users[id]} size={32} status={users[id].status} ringColor="var(--bg-secondary)" />
          <span className={memberStyles.info}>
            <span className={memberStyles.nameRow}>
              <span className={memberStyles.name}>{users[id].displayName}</span>
              {id === group.ownerId && <span title="Group Owner">👑</span>}
            </span>
          </span>
        </ProfileTrigger>
      ))}
    </aside>
  )
}

export default GroupMembers
