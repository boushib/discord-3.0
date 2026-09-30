'use client'

import classNames from 'classnames'
import { useAppDispatch, useSelector } from '../../hooks'
import AddIcon from '../../icons/Add'
import DiscordIcon from '../../icons/Discord'
import DownloadIcon from '../../icons/Download'
import ExploreIcon from '../../icons/Explore'
import { Server } from '../../models'
import { setCurrentServer } from '../../store'
import styles from './Sidebar.module.sass'

interface Props {
  server: Server
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

const SidebarIcon = ({ server }: Props) => {
  const { currentServer } = useSelector(s => s.servers)

  const dispatch = useAppDispatch()

  const handleSetCurrentServer = () => {
    dispatch(setCurrentServer(server))
  }
  return (
    <div
      className={classNames({
        [styles.sidebar__icon__wrapper]: true,
        [styles['sidebar__icon__wrapper--active']]:
          server.id === currentServer.id,
      })}
      onClick={handleSetCurrentServer}
    >
      <div
        className={classNames({
          [styles.sidebar__icon]: true,
          [styles['sidebar__icon--primary']]: server.isPrimary,
          [styles['sidebar__icon--secondary']]: server.icon,
          [styles['sidebar__icon--active']]: server.id === currentServer.id,
        })}
        style={{
          backgroundImage: server.image ? `url('${server.image}')` : 'unset',
        }}
      >
        {server.isPrimary && <DiscordIcon />}
        {server.icon && getSidebarIcon(server.icon)}
      </div>
    </div>
  )
}

export default SidebarIcon
