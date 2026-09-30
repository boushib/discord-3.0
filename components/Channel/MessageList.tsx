'use client'

import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { CURRENT_USER_ID, MESSAGE_GROUP_WINDOW } from '../../constants'
import { useSelector } from '../../hooks'
import { formatDateDivider, isSameDay } from '../../lib/format'
import type { Message as MessageType } from '../../models'
import type { ChannelContext } from '../../store/selectors'
import { selectMessages } from '../../store/selectors'
import Message from '../Message'
import ChannelWelcome from './ChannelWelcome'
import styles from './Channel.module.sass'

interface Props {
  channelId: string
  context: ChannelContext
  /** Thread panels don't follow the channel search box */
  ignoreSearch?: boolean
}

const shouldGroup = (prev: MessageType | undefined, message: MessageType, newSince: number) =>
  !!prev &&
  prev.authorId === message.authorId &&
  !message.replyToId &&
  message.createdAt - prev.createdAt < MESSAGE_GROUP_WINDOW &&
  isSameDay(prev.createdAt, message.createdAt) &&
  !(prev.createdAt <= newSince && message.createdAt > newSince)

const MessageList = ({ channelId, context, ignoreSearch }: Props) => {
  const messages = useSelector(s => selectMessages(s, channelId))
  const search = useSelector(s => (ignoreSearch ? '' : s.ui.search.trim().toLowerCase()))
  const lastReadAt = useSelector(s => s.readState.lastReadAt[channelId] ?? s.readState.baseline)
  // Freeze the "new messages" marker at the moment the channel was opened
  const [newSince] = useState(lastReadAt)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)
  const server = context.kind === 'server' ? context.server : undefined

  const visible = search
    ? messages.filter(m => m.content.toLowerCase().includes(search))
    : messages
  const lastMessage = messages[messages.length - 1]

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    if (stickToBottom.current || lastMessage?.authorId === CURRENT_USER_ID) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length, lastMessage?.authorId, search])

  const onScroll = () => {
    const el = scrollerRef.current
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  const firstUnread = visible.find(m => m.createdAt > newSince && m.authorId !== CURRENT_USER_ID)

  return (
    <div ref={scrollerRef} className={`${styles.messages} scroller scroller--auto`} onScroll={onScroll}>
      <div className={styles.messagesInner}>
        {search ? (
          <div className={styles.searchResults}>
            {visible.length} result{visible.length === 1 ? '' : 's'} for “{search}”
          </div>
        ) : (
          <ChannelWelcome context={context} />
        )}
        {visible.map((message, i) => {
          const prev = visible[i - 1]
          const newDay = !prev || !isSameDay(prev.createdAt, message.createdAt)
          const isFirstUnread = message === firstUnread
          return (
            <Fragment key={message.id}>
              {(newDay || isFirstUnread) && (
                <div
                  className={`${styles.divider} ${isFirstUnread ? styles.dividerNew : ''}`}
                  role="separator"
                >
                  {newDay && <span className={styles.dividerDate}>{formatDateDivider(message.createdAt)}</span>}
                  {isFirstUnread && <span className={styles.dividerNewTag}>NEW</span>}
                </div>
              )}
              <Message
                message={message}
                server={server}
                grouped={!search && !newDay && shouldGroup(prev, message, newSince)}
              />
            </Fragment>
          )
        })}
        <div className={styles.messagesEnd} />
      </div>
    </div>
  )
}

export default MessageList
