'use client'

import classNames from 'classnames'
import { MicOff, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { channelHref } from '../../lib/routes'
import type { Channel, Server } from '../../models'
import { joinVoice, openModal, setVoice } from '../../store'
import { displayNameIn, selectIsUnread, selectMentionCount } from '../../store/selectors'
import Avatar from '../Avatar'
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
          onClick={() => {
            dispatch(joinVoice({ serverId: server.id, channelId: channel.id, userId: CURRENT_USER_ID }))
            dispatch(setVoice({ serverId: server.id, channelId: channel.id }))
          }}
        >
          {content}
        </button>
        {voiceUserIds.length > 0 && <VoiceUsers server={server} userIds={voiceUserIds} />}
      </div>
    )
  }

  return (
    <div className={styles.channelWrapper}>
      {unread && <span className={styles.unreadPill} />}
      <Link href={channelHref(server.id, channel.id)} className={className} aria-current={active ? 'page' : undefined}>
        {content}
      </Link>
    </div>
  )
}

export default ChannelItem
