'use client'

import { useParams } from 'next/navigation'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useSelector } from '../../hooks'
import AddIcon from '../../icons/Add'
import DiscordIcon from '../../icons/Discord'
import DownloadIcon from '../../icons/Download'
import ExploreIcon from '../../icons/Explore'
import { dmHref, isMe, serverHref } from '../../lib/routes'
import { openModal } from '../../store'
import { selectMentionCount, selectServerUnread } from '../../store/selectors'
import Avatar from '../Avatar'
import RailItem from './RailItem'
import ServerIcon from './ServerIcon'
import styles from './ServerRail.module.sass'

const ServerItem = ({ serverId, active }: { serverId: string; active: boolean }) => {
  const server = useSelector(s => s.servers.byId[serverId])
  const { unread, mentions } = useSelector(s => selectServerUnread(s, serverId), shallowEqual)
  return (
    <RailItem
      label={server.name}
      href={serverHref(serverId)}
      active={active}
      unread={unread}
      mentions={mentions}
    >
      <ServerIcon server={server} />
    </RailItem>
  )
}

const ServerRail = () => {
  const dispatch = useAppDispatch()
  const params = useParams<{ serverId?: string; channelId?: string }>()
  const order = useSelector(s => s.servers.order)
  const users = useSelector(s => s.users.byId)
  const unreadDMs = useSelector(
    s =>
      s.dms
        .map(dm => ({ dm, mentions: selectMentionCount(s, dm.id) }))
        .filter(({ dm, mentions }) => mentions > 0 && dm.id !== params.channelId),
    (a, b) => a.length === b.length && a.every((x, i) => x.dm === b[i].dm && x.mentions === b[i].mentions)
  )
  const home = params.serverId !== undefined && isMe(params.serverId)

  return (
    <nav className={styles.rail} aria-label="Servers sidebar">
      <RailItem label="Direct Messages" href="/channels/@me" active={home} variant="home">
        <DiscordIcon width={30} height={22} />
      </RailItem>

      {unreadDMs.map(({ dm, mentions }) => (
        <RailItem
          key={dm.id}
          label={users[dm.recipientId].displayName}
          href={dmHref(dm.id)}
          mentions={mentions}
        >
          <Avatar user={users[dm.recipientId]} size={48} />
        </RailItem>
      ))}

      <div className={styles.separator} />

      {order.map(id => (
        <ServerItem key={id} serverId={id} active={params.serverId === id} />
      ))}

      <RailItem
        label="Add a Server"
        variant="action"
        onClick={() => dispatch(openModal({ type: 'createServer' }))}
      >
        <AddIcon />
      </RailItem>
      <RailItem label="Explore Discoverable Servers" variant="action">
        <ExploreIcon />
      </RailItem>

      <div className={styles.separator} />

      <RailItem label="Download Apps" variant="action">
        <DownloadIcon />
      </RailItem>
    </nav>
  )
}

export default ServerRail
