import classNames from 'classnames'
import styles from './UserStatus.module.sass'

interface Props {
  status: string
}

const UserStatus = ({ status }: Props) => (
  <div
    className={classNames({
      [styles.user__status]: true,
      [styles[`user__status--${status}`]]: true,
    })}
  ></div>
)

export default UserStatus
