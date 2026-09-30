'use client'

import classNames from 'classnames'
import { CheckCheck, Copy, Folder as FolderIcon, FolderMinus, LogOut, UserPlus } from 'lucide-react'
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
import type { ServerFolder } from '../../models'
import { combineServers, groupName, markRead, moveServer, openModal, removeFolder, toggleFolder, updateFolder } from '../../store'
import { selectMentionCount, selectServerUnread } from '../../store/selectors'
import Avatar, { GroupAvatar } from '../Avatar'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import Tooltip from '../Tooltip'
import RailItem from './RailItem'
import ServerIcon from './ServerIcon'
import styles from './ServerRail.module.sass'

type Zone = 'before' | 'combine' | 'after'
interface Drag {
  from: number | null
  over: number | null
  zone: Zone | null
}
const NO_DRAG: Drag = { from: null, over: null, zone: null }

interface ServerItemProps {
  serverId: string
  index: number
  active: boolean
  drag: Drag
  setDrag: (drag: Drag) => void
}

/** Top/bottom quarter reorders, the middle combines into a folder */
const zoneAt = (e: React.DragEvent<HTMLElement>): Zone => {
  const rect = e.currentTarget.getBoundingClientRect()
  const y = (e.clientY - rect.top) / rect.height
  return y < 0.25 ? 'before' : y > 0.75 ? 'after' : 'combine'
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

  const dropIndicator = drag.from !== null && drag.over === index && drag.from !== index ? drag.zone : null
  const order = useSelector(s => s.servers.order)

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
            e.stopPropagation()
            e.dataTransfer.effectAllowed = 'move'
            setDrag({ from: index, over: index, zone: null })
          },
          onDragOver: e => {
            e.preventDefault()
            e.stopPropagation()
            const zone = zoneAt(e)
            if (drag.over !== index || drag.zone !== zone) setDrag({ ...drag, over: index, zone })
          },
          onDrop: e => {
            e.preventDefault()
            e.stopPropagation()
            const { from } = drag
            if (from !== null && from !== index) {
              if (zoneAt(e) === 'combine') dispatch(combineServers({ serverId: order[from], targetId: serverId }))
              else {
                const to = zoneAt(e) === 'after' ? (from < index ? index : index + 1) : from < index ? index - 1 : index
                dispatch(moveServer({ from, to }))
              }
            }
            setDrag(NO_DRAG)
          },
          onDragEnd: () => setDrag(NO_DRAG),
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

const FOLDER_COLORS = ['#5865f2', '#3ba55c', '#faa61a', '#ed4245', '#eb459e', '#1abc9c', '#99aab5']

const FolderItem = ({
  folder,
  indexOf,
  activeId,
  drag,
  setDrag,
}: {
  folder: ServerFolder
  indexOf: (id: string) => number
  activeId?: string
  drag: Drag
  setDrag: (drag: Drag) => void
}) => {
  const dispatch = useAppDispatch()
  const servers = useSelector(s => s.servers.byId)
  const summary = useSelector(
    s =>
      folder.serverIds.reduce(
        (acc, id) => {
          const u = selectServerUnread(s, id)
          return { unread: acc.unread || u.unread, mentions: acc.mentions + u.mentions }
        },
        { unread: false, mentions: 0 }
      ),
    shallowEqual
  )
  const [menu, setMenu] = useState<DOMRect | null>(null)
  const members = folder.serverIds.map(id => servers[id]).filter(Boolean)
  const label = folder.name || members.map(m => m.name).join(', ')
  const containsActive = !!activeId && folder.serverIds.includes(activeId)

  return (
    <div
      className={classNames(styles.folder, folder.expanded && styles.folderOpen)}
      style={{ '--folder-color': folder.color } as React.CSSProperties}
    >
      <div
        className={classNames(
          styles.item,
          !folder.expanded && containsActive && styles.itemActive,
          !folder.expanded && summary.unread && styles.itemUnread
        )}
      >
        <span className={styles.pill} />
        <Tooltip label={label} placement="right" large>
          <button
            type="button"
            className={styles.button}
            aria-label={label}
            aria-expanded={folder.expanded}
            onClick={() => dispatch(toggleFolder(folder.id))}
            onContextMenu={e => {
              e.preventDefault()
              setMenu(new DOMRect(e.clientX, e.clientY, 0, 0))
            }}
          >
            <span className={classNames(styles.icon, styles.folderIcon)}>
              {folder.expanded ? (
                <FolderIcon size={22} fill="currentColor" />
              ) : (
                <span className={styles.folderGrid}>
                  {members.slice(0, 4).map(m => (
                    <span key={m.id} className={styles.folderMini}>
                      <ServerIcon server={m} />
                    </span>
                  ))}
                </span>
              )}
            </span>
          </button>
        </Tooltip>
        {!folder.expanded && summary.mentions > 0 && <span className={styles.badge}>{summary.mentions}</span>}
      </div>
      {folder.expanded &&
        folder.serverIds.map(id => (
          <ServerItem key={id} serverId={id} index={indexOf(id)} active={activeId === id} drag={drag} setDrag={setDrag} />
        ))}
      {menu && (
        <Popover anchor={menu} placement="right-start" offset={0} onClose={() => setMenu(null)}>
          <div className={styles.folderMenu}>
            <label className={styles.folderField}>
              <span>Folder Name</span>
              <input
                autoFocus
                defaultValue={folder.name ?? ''}
                placeholder={members.map(m => m.name).join(', ')}
                onBlur={e => dispatch(updateFolder({ folderId: folder.id, changes: { name: e.target.value.trim() || undefined } }))}
                onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
              />
            </label>
            <span className={styles.folderFieldLabel}>Folder Color</span>
            <div className={styles.folderColors}>
              {FOLDER_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Color ${color}`}
                  className={classNames(styles.folderColor, folder.color === color && styles.folderColorOn)}
                  style={{ backgroundColor: color }}
                  onClick={() => dispatch(updateFolder({ folderId: folder.id, changes: { color } }))}
                />
              ))}
            </div>
            <Menu className={styles.folderMenuList}>
              <MenuItem
                label="Mark Folder As Read"
                icon={<CheckCheck size={16} />}
                onClick={() => {
                  members.forEach(m => m.channels.forEach(c => dispatch(markRead(c.id))))
                  setMenu(null)
                }}
              />
              <MenuItem
                danger
                label="Ungroup Folder"
                icon={<FolderMinus size={16} />}
                onClick={() => {
                  dispatch(removeFolder(folder.id))
                  setMenu(null)
                }}
              />
            </Menu>
          </div>
        </Popover>
      )}
    </div>
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
  const unreadGroups = useSelector(
    s =>
      s.groups
        .map(group => ({ group, mentions: selectMentionCount(s, group.id) }))
        .filter(({ group, mentions }) => mentions > 0 && group.id !== params.channelId),
    (a, b) => a.length === b.length && a.every((x, i) => x.group === b[i].group && x.mentions === b[i].mentions)
  )
  const home = params.serverId !== undefined && isMe(params.serverId)
  const [drag, setDrag] = useState<Drag>(NO_DRAG)
  const folders = useSelector(s => s.servers.folders)
  const folderByServer = new Map(Object.values(folders).flatMap(f => f.serverIds.map(id => [id, f] as const)))
  const rendered = new Set<string>()

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

      {unreadGroups.map(({ group, mentions }) => (
        <RailItem
          key={group.id}
          label={groupName(group, id => users[id]?.displayName ?? 'Unknown')}
          href={dmHref(group.id)}
          mentions={mentions}
        >
          <GroupAvatar members={group.memberIds.map(id => users[id]).filter(Boolean)} size={48} />
        </RailItem>
      ))}

      <div className={styles.separator} />

      {order.map((id, index) => {
        const folder = folderByServer.get(id)
        if (!folder) {
          return (
            <ServerItem key={id} serverId={id} index={index} active={params.serverId === id} drag={drag} setDrag={setDrag} />
          )
        }
        // Folder members are contiguous; render the folder once, at its first member
        if (rendered.has(folder.id)) return null
        rendered.add(folder.id)
        return (
          <FolderItem
            key={folder.id}
            folder={folder}
            indexOf={serverId => order.indexOf(serverId)}
            activeId={params.serverId}
            drag={drag}
            setDrag={setDrag}
          />
        )
      })}

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
