import type { User } from '../../models'
import Avatar from './Avatar'
import styles from './Avatar.module.sass'

/** Two overlapping member avatars, used for group DMs */
const GroupAvatar = ({ members, size = 32 }: { members: User[]; size?: number }) => {
  const [a, b] = members
  if (!b) return a ? <Avatar user={a} size={size} /> : null
  const inner = Math.round(size * 0.7)
  return (
    <span className={styles.group} style={{ width: size, height: size }}>
      <Avatar user={a} size={inner} className={styles.groupBack} />
      <Avatar user={b} size={inner} className={styles.groupFront} />
    </span>
  )
}

export default GroupAvatar
