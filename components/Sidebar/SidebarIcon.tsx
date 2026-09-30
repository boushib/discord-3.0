'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSelector } from '../../hooks'
import AddIcon from '../../icons/Add'
import DiscordIcon from '../../icons/Discord'
import ExploreIcon from '../../icons/Explore'
import { serverHref } from '../../lib/routes'
import styles from './Sidebar.module.sass'

interface Props {
  id: string
  name?: string
  kind: 'home' | 'server' | 'add' | 'explore'
}

const SidebarIcon = ({ id, name, kind }: Props) => {
  const params = useParams<{ serverId?: string }>()
  const server = useSelector(s => s.servers.byId[id])
  const active = params.serverId !== undefined && decodeURIComponent(params.serverId) === id

  const icon = (
    <div
      className={classNames({
        [styles.sidebar__icon]: true,
        [styles['sidebar__icon--primary']]: kind === 'home',
        [styles['sidebar__icon--secondary']]: kind === 'add' || kind === 'explore',
        [styles['sidebar__icon--active']]: active,
      })}
      style={{ backgroundImage: server?.icon ? `url('${server.icon}')` : undefined }}
      title={name ?? server?.name}
    >
      {kind === 'home' && <DiscordIcon />}
      {kind === 'add' && <AddIcon />}
      {kind === 'explore' && <ExploreIcon />}
    </div>
  )

  const wrapperClass = classNames({
    [styles.sidebar__icon__wrapper]: true,
    [styles['sidebar__icon__wrapper--active']]: active,
  })

  if (kind === 'home' || kind === 'server') {
    return (
      <Link href={serverHref(id)} className={wrapperClass}>
        {icon}
      </Link>
    )
  }
  return <div className={wrapperClass}>{icon}</div>
}

export default SidebarIcon
