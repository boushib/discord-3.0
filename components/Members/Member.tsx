import styles from './Member.module.sass'

interface Props {
  avatar: string
  username: string
}

const Member = ({ avatar, username }: Props) => (
  <div className={styles.member}>
    <div
      className={styles.member__avatar}
      style={{ backgroundImage: `url('${avatar}')` }}
    ></div>
    <div className={styles.member__username}>{username}</div>
  </div>
)

export default Member
