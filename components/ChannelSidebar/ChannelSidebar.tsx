'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSelector } from '../../hooks'
import ChannelIcon from '../../icons/Channel'
import VerifiedIcon from '../../icons/Verified'
import { channelHref } from '../../lib/routes'
import styles from './ChannelSidebar.module.sass'

const ChannelSidebar = ({ serverId }: { serverId: string }) => {
  const server = useSelector(s => s.servers.byId[serverId])
  const { channelId } = useParams<{ channelId?: string }>()
  if (!server) return null

  return (
    <div className={styles.server__sidebar}>
      <div className={styles.server__sidebar__name}>
        {server.verified && <VerifiedIcon />} {server.name}
      </div>
      {server.categories.map(category => (
        <div key={category.id}>
          <div className={styles.server__sidebar__category}>{category.name}</div>
          {server.channels
            .filter(c => c.categoryId === category.id)
            .map(c => (
              <div className={styles.server__sidebar__channel__wrapper} key={c.id}>
                <Link
                  href={channelHref(server.id, c.id)}
                  className={classNames({
                    [styles.server__sidebar__channel]: true,
                    [styles['server__sidebar__channel--active']]: c.id === channelId,
                  })}
                >
                  <ChannelIcon />
                  {c.name}
                </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default ChannelSidebar
