'use client'

import classNames from 'classnames'
import { CornerUpLeft, Pin } from 'lucide-react'
import { memo, useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatFull, formatTime, formatTimestamp } from '../../lib/format'
import type { Message as MessageType, Server } from '../../models'
import { toggleReaction } from '../../store'
import { displayNameIn, isMention, roleColorIn } from '../../store/selectors'
import Avatar from '../Avatar'
import Markdown from '../Markdown'
import Popover from '../Popover'
import { ProfileTrigger } from '../Profile'
import Tooltip from '../Tooltip'
import { MessageMenu, MessageToolbar } from './MessageActions'
import MessageEditor from './MessageEditor'
import styles from './Message.module.sass'

interface Props {
  message: MessageType
  server?: Server
  grouped: boolean
  /** Static rendering (e.g. inside the delete confirmation) */
  preview?: boolean
}

const ReplyPreview = ({ message, server }: { message: MessageType; server?: Server }) => {
  const replied = useSelector(s => s.messages[message.channelId]?.find(m => m.id === message.replyToId))
  const author = useSelector(s => (replied ? s.users.byId[replied.authorId] : undefined))
  return (
    <div className={styles.reply}>
      <span className={styles.replySpine} />
      {replied && author ? (
        <>
          <Avatar user={author} size={16} />
          <span className={styles.replyName} style={{ color: roleColorIn(server, author.id) }}>
            @{displayNameIn(server, author)}
          </span>
          <span
            className={styles.replyContent}
            onClick={() =>
              document
                .getElementById(`message-${replied.id}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          >
            {replied.content}
          </span>
        </>
      ) : (
        <>
          <CornerUpLeft size={14} />
          <span className={styles.replyDeleted}>Original message was deleted</span>
        </>
      )}
    </div>
  )
}

const Message = ({ message, server, grouped: groupedProp, preview }: Props) => {
  const dispatch = useAppDispatch()
  const [contextMenu, setContextMenu] = useState<DOMRect | null>(null)
  const editing = useSelector(
    s => !preview && s.ui.editing?.messageId === message.id && s.ui.editing.channelId === message.channelId
  )
  const author = useSelector(s => s.users.byId[message.authorId])
  const users = useSelector(s => s.users.byId)
  const compact = useSelector(s => s.prefs.compactMode && !preview)
  // Compact mode shows the author on every line
  const grouped = groupedProp && !compact
  const mentioned = useSelector(s => message.authorId !== CURRENT_USER_ID && isMention(s, message))
  const color = roleColorIn(server, author.id)

  return (
    <article
      id={`message-${message.id}`}
      className={classNames(
        styles.message,
        grouped && styles.grouped,
        compact && styles.compact,
        mentioned && styles.mentioned,
        (editing || contextMenu) && styles.active
      )}
      onContextMenu={
        preview
          ? undefined
          : e => {
              e.preventDefault()
              setContextMenu(new DOMRect(e.clientX, e.clientY, 0, 0))
            }
      }
    >
      {message.replyToId && <ReplyPreview message={message} server={server} />}
      <div className={styles.row}>
        <div className={styles.gutter}>
          {grouped ? (
            <time className={styles.hoverTime} dateTime={new Date(message.createdAt).toISOString()}>
              {formatTime(message.createdAt)}
            </time>
          ) : (
            <ProfileTrigger userId={author.id} server={server} className={styles.avatarButton}>
              <Avatar user={author} size={40} />
            </ProfileTrigger>
          )}
        </div>
        <div className={styles.contents}>
          {!grouped && (
            <h3 className={styles.header}>
              <ProfileTrigger userId={author.id} server={server} className={styles.username}>
                <span style={{ color }}>{displayNameIn(server, author)}</span>
              </ProfileTrigger>
              {author.bot && <span className={styles.botTag}>✓ BOT</span>}
              <Tooltip label={formatFull(message.createdAt)}>
                <time className={styles.time} dateTime={new Date(message.createdAt).toISOString()}>
                  {formatTimestamp(message.createdAt)}
                </time>
              </Tooltip>
            </h3>
          )}
          {editing ? (
            <MessageEditor message={message} />
          ) : (
            <div className={styles.body}>
              <Markdown content={message.content} />
              {message.editedAt && (
                <Tooltip label={formatFull(message.editedAt)}>
                  <span className={styles.edited}>(edited)</span>
                </Tooltip>
              )}
              {message.pinned && (
                <Tooltip label="Pinned">
                  <span className={styles.pinned}>
                    <Pin size={12} />
                  </span>
                </Tooltip>
              )}
            </div>
          )}
          {message.reactions.length > 0 && (
            <div className={styles.reactions}>
              {message.reactions.map(r => {
                const me = r.userIds.includes(CURRENT_USER_ID)
                const names = r.userIds.map(id => users[id]?.displayName ?? 'Someone')
                return (
                  <Tooltip
                    key={r.emoji}
                    label={`${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''} reacted with ${r.emoji}`}
                  >
                    <button
                      type="button"
                      className={classNames(styles.reaction, me && styles.reactionMe)}
                      aria-pressed={me}
                      onClick={() =>
                        dispatch(
                          toggleReaction({
                            channelId: message.channelId,
                            messageId: message.id,
                            emoji: r.emoji,
                            userId: CURRENT_USER_ID,
                          })
                        )
                      }
                    >
                      <span className={styles.reactionEmoji}>{r.emoji}</span>
                      <span className={styles.reactionCount}>{r.userIds.length}</span>
                    </button>
                  </Tooltip>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {!preview && !editing && <MessageToolbar message={message} />}
      {contextMenu && (
        <Popover anchor={contextMenu} placement="right-start" offset={0} onClose={() => setContextMenu(null)}>
          <MessageMenu message={message} onDone={() => setContextMenu(null)} />
        </Popover>
      )}
    </article>
  )
}

export default memo(Message)
