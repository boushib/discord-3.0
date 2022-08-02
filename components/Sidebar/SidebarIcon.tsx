import classNames from 'classnames'
import AddIcon from '../../icons/Add'
import DiscordIcon from '../../icons/Discord'
import DownloadIcon from '../../icons/Download'
import ExploreIcon from '../../icons/Explore'
import styles from './Sidebar.module.sass'

interface Props {
  image?: string
  icon?: string
  isPrimary?: boolean
  isActive?: boolean
  onClick: () => void
}

const getSidebarIcon = (key: string): React.ReactNode => {
  switch (key) {
    case 'add':
      return <AddIcon />
    case 'explore':
      return <ExploreIcon />
    case 'download':
      return <DownloadIcon />
    default:
      return null
  }
}

const SidebarIcon = ({
  image,
  icon,
  isPrimary = false,
  isActive = false,
  onClick,
}: Props) => (
  <div
    className={classNames({
      [styles.sidebar__icon__wrapper]: true,
      [styles['sidebar__icon__wrapper--active']]: isActive,
    })}
    onClick={onClick}
  >
    <div
      className={classNames({
        [styles.sidebar__icon]: true,
        [styles['sidebar__icon--primary']]: isPrimary,
        [styles['sidebar__icon--secondary']]: icon,
        [styles['sidebar__icon--active']]: isActive,
      })}
      style={{ backgroundImage: image ? `url('${image}')` : 'unset' }}
    >
      {isPrimary && <DiscordIcon />}
      {icon && getSidebarIcon(icon)}
    </div>
  </div>
)

export default SidebarIcon
