'use client'

import { Pin, X } from 'lucide-react'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import { togglePin } from '../../store'
import { ChannelContext, displayNameIn, roleColorIn, selectMessages } from '../../store/selectors'
import Avatar from '../Avatar'
import Markdown from '../Markdown'
import styles from './PinnedMessages.module.sass'

interface Props {
  channelId: string
  context: ChannelContext
  onJump: () => void
}

const PinnedMessages = ({ channelId, context, onJump }: Props) => {
  const dispatch = useAppDispatch()
  const messages = useSelector(s => selectMessages(s, channelId))
  const users = useSelector(s => s.users.byId)
  const pinned = messages.filter(m => m.pinned).reverse()
  const server = context.kind === 'server' ? context.server : undefined

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <Pin size={20} />
        <h2>Pinned Messages</h2>
      </header>
      <div className={`${styles.list} scroller`}>
        {pinned.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📌</div>
            <p>This channel doesn’t have any pinned messages… yet.</p>
          </div>
        ) : (
          pinned.map(message => {
            const author = users[message.authorId]
            return (
              <div key={message.id} className={styles.item}>
                <Avatar user={author} size={40} />
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.name} style={{ color: roleColorIn(server, author.id) }}>
                      {displayNameIn(server, author)}
                    </span>
                    <span className={styles.time}>{formatTimestamp(message.createdAt)}</span>
                  </div>
                  <div className={styles.body}>
                    <Markdown content={message.content} />
                  </div>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.jump}
                    onClick={() => {
                      onJump()
                      const el = document.getElementById(`message-${message.id}`)
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      el?.animate(
                        [{ backgroundColor: 'rgba(88, 101, 242, .25)' }, { backgroundColor: 'transparent' }],
                        { duration: 1600 }
                      )
                    }}
                  >
                    Jump
                  </button>
                  <button
                    type="button"
                    className={styles.unpin}
                    aria-label="Unpin"
                    onClick={() => dispatch(togglePin({ channelId, messageId: message.id }))}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PinnedMessages
