import classNames from 'classnames'
import DiscordIcon from '../../icons/Discord'
import styles from './Sidebar.module.sass'

interface Props {
  image?: string
  isPrimary?: boolean
  isActive?: boolean
}

const SidebarIcon = ({ image, isPrimary = false, isActive = false }: Props) => (
  <div
    className={classNames({
      [styles.sidebar__icon__wrapper]: true,
      [styles['sidebar__icon__wrapper--active']]: isActive,
    })}
  >
    <div
      className={classNames({
        [styles.sidebar__icon]: true,
        [styles['sidebar__icon--primary']]: isPrimary,
        [styles['sidebar__icon--active']]: isActive,
      })}
      style={{ backgroundImage: `url('${image}')` }}
    >
      {isPrimary && <DiscordIcon />}
    </div>
  </div>
)

export default SidebarIcon
