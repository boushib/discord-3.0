'use client'

import classNames from 'classnames'
import { CheckCheck, Copy, Link2, MicOff, Settings, UserPlus } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { channelHref } from '../../lib/routes'
import type { Channel, Server } from '../../models'
import { joinVoice, markRead, openModal, setVoice } from '../../store'
import { displayNameIn, selectIsUnread, selectMentionCount } from '../../store/selectors'
import Avatar from '../Avatar'
import Popover, { Menu, MenuItem, MenuSeparator } from '../Popover'
import ChannelTypeIcon from '../ChannelTypeIcon'
import Tooltip from '../Tooltip'
import styles from './ChannelSidebar.module.sass'

interface Props {
  server: Server
  channel: Channel
  active: boolean
}

const VoiceUsers = ({ server, userIds }: { server: Server; userIds: string[] }) => {
  const users = useSelector(s => s.users.byId)
  const muted = useSelector(s => s.prefs.muted)
  return (
    <ul className={styles.voiceUsers}>
      {userIds.map(id => (
        <li key={id} className={styles.voiceUser}>
          <Avatar user={users[id]} size={24} />
          <span className={styles.voiceUserName}>{displayNameIn(server, users[id])}</span>
          {id === CURRENT_USER_ID && muted && <MicOff size={16} className={styles.voiceUserIcon} />}
        </li>
      ))}
    </ul>
  )
}

const ChannelItem = ({ server, channel, active }: Props) => {
  const dispatch = useAppDispatch()
  const unread = useSelector(s => !active && selectIsUnread(s, channel.id))
  const mentions = useSelector(s => (active ? 0 : selectMentionCount(s, channel.id)))
  const voiceUserIds = server.voiceStates[channel.id] ?? []
  const connected = useSelector(s => s.ui.voice?.channelId === channel.id)
  const isOwner = server.ownerId === CURRENT_USER_ID
  const [menu, setMenu] = useState<DOMRect | null>(null)
  const closeMenu = () => setMenu(null)
  const run = (fn: () => void) => () => {
    closeMenu()
    fn()
  }
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenu(new DOMRect(e.clientX, e.clientY, 0, 0))
  }

  const contextMenu = menu && (
    <Popover anchor={menu} placement="right-start" offset={0} onClose={closeMenu}>
      <Menu>
        {channel.type !== 'voice' && (
          <MenuItem
            label="Mark As Read"
            icon={<CheckCheck size={16} />}
            disabled={!unread && !mentions}
            onClick={run(() => dispatch(markRead(channel.id)))}
          />
        )}
        <MenuItem
          label="Invite People"
          icon={<UserPlus size={16} />}
          onClick={run(() => dispatch(openModal({ type: 'invite', serverId: server.id })))}
        />
        <MenuItem
          label="Copy Link"
          icon={<Link2 size={16} />}
          onClick={run(() =>
            navigator.clipboard?.writeText(`${window.location.origin}${channelHref(server.id, channel.id)}`)
          )}
        />
        {isOwner && (
          <>
            <MenuSeparator />
            <MenuItem
              label="Edit Channel"
              icon={<Settings size={16} />}
              onClick={run(() =>
                dispatch(openModal({ type: 'editChannel', serverId: server.id, channelId: channel.id }))
              )}
            />
          </>
        )}
        <MenuSeparator />
        <MenuItem
          label="Copy Channel ID"
          icon={<Copy size={16} />}
          onClick={run(() => navigator.clipboard?.writeText(channel.id))}
        />
      </Menu>
    </Popover>
  )

  const className = classNames(
    styles.channel,
    active && styles.channelActive,
    (unread || mentions > 0) && styles.channelUnread,
    connected && styles.channelConnected
  )

  const content = (
    <>
      <ChannelTypeIcon type={channel.type} size={20} className={styles.channelIcon} />
      <span className={styles.channelName}>{channel.name}</span>
      <span className={styles.channelActions}>
        <Tooltip label="Create Invite">
          <span
            role="button"
            tabIndex={-1}
            className={styles.channelAction}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              dispatch(openModal({ type: 'invite', serverId: server.id }))
            }}
          >
            <UserPlus size={16} />
          </span>
        </Tooltip>
      </span>
      {mentions > 0 && <span className={styles.mentionBadge}>{mentions}</span>}
    </>
  )

  if (channel.type === 'voice') {
    return (
      <div className={styles.channelWrapper}>
        <button
          type="button"
          className={className}
          onContextMenu={onContextMenu}
          onClick={() => {
            dispatch(joinVoice({ serverId: server.id, channelId: channel.id, userId: CURRENT_USER_ID }))
            dispatch(setVoice({ serverId: server.id, channelId: channel.id }))
          }}
        >
          {content}
        </button>
        {voiceUserIds.length > 0 && <VoiceUsers server={server} userIds={voiceUserIds} />}
        {contextMenu}
      </div>
    )
  }

  return (
    <div className={styles.channelWrapper}>
      {unread && <span className={styles.unreadPill} />}
      <Link
        href={channelHref(server.id, channel.id)}
        className={className}
        aria-current={active ? 'page' : undefined}
        onContextMenu={onContextMenu}
      >
        {content}
      </Link>
      {contextMenu}
    </div>
  )
}

export default ChannelItem
