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
}

const shouldGroup = (prev: MessageType | undefined, message: MessageType, newSince: number) =>
  !!prev &&
  prev.authorId === message.authorId &&
  !message.replyToId &&
  message.createdAt - prev.createdAt < MESSAGE_GROUP_WINDOW &&
  isSameDay(prev.createdAt, message.createdAt) &&
  !(prev.createdAt <= newSince && message.createdAt > newSince)

const MessageList = ({ channelId, context }: Props) => {
  const messages = useSelector(s => selectMessages(s, channelId))
  const lastReadAt = useSelector(s => s.readState.lastReadAt[channelId] ?? s.readState.baseline)
  // Freeze the "new messages" marker at the moment the channel was opened;
  // only messages that were already there (and unread) get the NEW line
  const [newSince] = useState(lastReadAt)
  const [countAtOpen] = useState(messages.length)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)
  // Message count when the user scrolled up, used for the "jump to present" bar
  const [awayAt, setAwayAt] = useState<number | null>(null)
  const server = context.kind === 'server' ? context.server : undefined

  const visible = messages
  const lastMessage = messages[messages.length - 1]

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    if (stickToBottom.current || lastMessage?.authorId === CURRENT_USER_ID) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length, lastMessage?.authorId])

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    stickToBottom.current = atBottom
    // Only show the bar once the user is well away from the latest messages
    const farAway = el.scrollHeight - el.scrollTop - el.clientHeight > 600
    if (atBottom && awayAt !== null) setAwayAt(null)
    else if (farAway && awayAt === null) setAwayAt(messages.length)
  }

  const jumpToPresent = () => {
    const el = scrollerRef.current
    if (!el) return
    stickToBottom.current = true
    setAwayAt(null)
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  const newWhileAway =
    awayAt === null ? 0 : messages.slice(awayAt).filter(m => m.authorId !== CURRENT_USER_ID).length

  const firstUnread = visible
    .slice(0, countAtOpen)
    .find(m => m.createdAt > newSince && m.authorId !== CURRENT_USER_ID)

  return (
    <div className={styles.messagesWrap}>
      <div ref={scrollerRef} className={`${styles.messages} scroller scroller--auto`} onScroll={onScroll}>
        <div className={styles.messagesInner}>
          <ChannelWelcome context={context} />
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
                  grouped={!newDay && shouldGroup(prev, message, newSince)}
                />
              </Fragment>
            )
          })}
          <div className={styles.messagesEnd} />
        </div>
      </div>
      {awayAt !== null && (
        <button type="button" className={styles.jumpBar} onClick={jumpToPresent}>
          <span>
            {newWhileAway > 0
              ? `${newWhileAway} new message${newWhileAway === 1 ? '' : 's'}`
              : 'You’re viewing older messages'}
          </span>
          <strong>Jump To Present</strong>
        </button>
      )}
    </div>
  )
}

export default MessageList
