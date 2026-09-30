import { DEFAULT_AVATAR } from '../../constants'
import styles from './Member.module.sass'
import UserStatus from './UserStatus'

interface Props {
  id: number
  avatar: string
  username: string
}

const STATUS = ['online', 'idle', 'dnd']

const Member = ({ id, avatar, username }: Props) => (
  <div className={styles.member}>
    <div
      className={styles.member__avatar}
      style={{ backgroundImage: `url('${avatar || DEFAULT_AVATAR}')` }}
    >
      <UserStatus status={STATUS[id % STATUS.length]} />
    </div>
    <div className={styles.member__username}>{username}</div>
  </div>
)

export default Member
