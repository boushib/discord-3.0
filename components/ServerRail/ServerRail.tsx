'use client'

import { CheckCheck, Copy, LogOut, UserPlus } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { shallowEqual } from 'react-redux'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import AddIcon from '../../icons/Add'
import DiscordIcon from '../../icons/Discord'
import DownloadIcon from '../../icons/Download'
import ExploreIcon from '../../icons/Explore'
import { dmHref, isMe, serverHref } from '../../lib/routes'
import { markRead, moveServer, openModal } from '../../store'
import { selectMentionCount, selectServerUnread } from '../../store/selectors'
import Avatar from '../Avatar'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import RailItem from './RailItem'
import ServerIcon from './ServerIcon'
import styles from './ServerRail.module.sass'

interface ServerItemProps {
  serverId: string
  index: number
  active: boolean
  drag: { from: number | null; over: number | null }
  setDrag: (drag: { from: number | null; over: number | null }) => void
}

const ServerItem = ({ serverId, index, active, drag, setDrag }: ServerItemProps) => {
  const dispatch = useAppDispatch()
  const server = useSelector(s => s.servers.byId[serverId])
  const { unread, mentions } = useSelector(s => selectServerUnread(s, serverId), shallowEqual)
  const [menu, setMenu] = useState<DOMRect | null>(null)
  const closeMenu = () => setMenu(null)
  const run = (fn: () => void) => () => {
    closeMenu()
    fn()
  }

  const dropIndicator =
    drag.from !== null && drag.over === index && drag.from !== index
      ? drag.from > index
        ? 'before'
        : 'after'
      : null

  return (
    <>
      <RailItem
        label={server.name}
        href={serverHref(serverId)}
        active={active}
        unread={unread}
        mentions={mentions}
        dropIndicator={dropIndicator}
        onContextMenu={e => {
          e.preventDefault()
          setMenu(new DOMRect(e.clientX, e.clientY, 0, 0))
        }}
        dragProps={{
          draggable: true,
          onDragStart: e => {
            e.dataTransfer.effectAllowed = 'move'
            setDrag({ from: index, over: index })
          },
          onDragOver: e => {
            e.preventDefault()
            if (drag.over !== index) setDrag({ ...drag, over: index })
          },
          onDrop: e => {
            e.preventDefault()
            if (drag.from !== null && drag.from !== index) dispatch(moveServer({ from: drag.from, to: index }))
            setDrag({ from: null, over: null })
          },
          onDragEnd: () => setDrag({ from: null, over: null }),
        }}
      >
        <ServerIcon server={server} />
      </RailItem>
      {menu && (
        <Popover anchor={menu} placement="right-start" offset={0} onClose={closeMenu}>
          <Menu>
            <MenuItem
              label="Mark As Read"
              icon={<CheckCheck size={16} />}
              disabled={!unread && !mentions}
              onClick={run(() => server.channels.forEach(c => dispatch(markRead(c.id))))}
            />
            <MenuSeparator />
            <MenuItem
              brand
              label="Invite People"
              icon={<UserPlus size={16} />}
              onClick={run(() => dispatch(openModal({ type: 'invite', serverId })))}
            />
            <MenuItem
              label="Copy Server ID"
              icon={<Copy size={16} />}
              onClick={run(() => navigator.clipboard?.writeText(serverId))}
            />
            {server.ownerId !== CURRENT_USER_ID && (
              <>
                <MenuSeparator />
                <MenuItem
                  danger
                  label="Leave Server"
                  icon={<LogOut size={16} />}
                  onClick={run(() => dispatch(openModal({ type: 'leaveServer', serverId })))}
                />
              </>
            )}
          </Menu>
        </Popover>
      )}
    </>
  )
}

const ServerRail = () => {
  const dispatch = useAppDispatch()
  const params = useParams<{ serverId?: string; channelId?: string }>()
  const pathname = usePathname()
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
  const [drag, setDrag] = useState<{ from: number | null; over: number | null }>({ from: null, over: null })

  return (
    <nav className={styles.rail} aria-label="Servers sidebar" data-panel="nav">
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

      {order.map((id, index) => (
        <ServerItem
          key={id}
          serverId={id}
          index={index}
          active={params.serverId === id}
          drag={drag}
          setDrag={setDrag}
        />
      ))}

      <RailItem
        label="Add a Server"
        variant="action"
        onClick={() => dispatch(openModal({ type: 'createServer' }))}
      >
        <AddIcon />
      </RailItem>
      <RailItem
        label="Explore Discoverable Servers"
        variant="action"
        href="/channels/discovery"
        active={pathname === '/channels/discovery'}
      >
        <ExploreIcon />
      </RailItem>

      <div className={styles.separator} />

      <RailItem label="Download Apps" variant="action" onClick={() => dispatch(openModal({ type: 'download' }))}>
        <DownloadIcon />
      </RailItem>
    </nav>
  )
}

export default ServerRail
