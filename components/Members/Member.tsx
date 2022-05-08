import styles from './Member.module.sass'
import UserStatus from './UserStatus'

interface Props {
  avatar: string
  username: string
}

const STATUS = ['online', 'idle', 'dnd']

const Member = ({ avatar, username }: Props) => (
  <div className={styles.member}>
    <div
      className={styles.member__avatar}
      style={{ backgroundImage: `url('${avatar}')` }}
    >
      <UserStatus status={STATUS[Math.floor(Math.random() * 3)]} />
    </div>
    <div className={styles.member__username}>{username}</div>
  </div>
)

export default Member
