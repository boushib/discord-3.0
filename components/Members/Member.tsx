import type { User } from '../../models'
import Avatar from '../Avatar'
import styles from './Member.module.sass'

const Member = ({ user }: { user: User }) => (
  <div className={styles.member}>
    <Avatar user={user} size={32} status={user.status} />
    <div className={styles.member__username}>{user.displayName}</div>
  </div>
)

export default Member
