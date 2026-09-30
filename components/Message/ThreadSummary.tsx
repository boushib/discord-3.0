'use client'

import { ChevronRight } from 'lucide-react'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import { setOpenThread } from '../../store'
import { selectMessages } from '../../store/selectors'
import Avatar from '../Avatar'
import styles from './Message.module.sass'

/** "Thread name · 3 Messages" card shown under a thread's starter message */
const ThreadSummary = ({ threadId }: { threadId: string }) => {
  const dispatch = useAppDispatch()
  const thread = useSelector(s => s.threads[threadId])
  const messages = useSelector(s => selectMessages(s, threadId))
  const last = messages[messages.length - 1]
  const lastAuthor = useSelector(s => (last ? s.users.byId[last.authorId] : undefined))
  if (!thread) return null

  return (
    <button type="button" className={styles.threadSummary} onClick={() => dispatch(setOpenThread(threadId))}>
      <span className={styles.threadTop}>
        <strong>{thread.name}</strong>
        <span className={styles.threadCount}>
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'} <ChevronRight size={14} />
        </span>
      </span>
      {last && lastAuthor ? (
        <span className={styles.threadLast}>
          <Avatar user={lastAuthor} size={16} />
          <span className={styles.threadLastName}>{lastAuthor.displayName}</span>
          <span className={styles.threadLastText}>{last.content || 'sent an attachment'}</span>
          <span className={styles.threadLastTime}>{formatTimestamp(last.createdAt)}</span>
        </span>
      ) : (
        <span className={styles.threadLast}>There are no recent messages in this thread.</span>
      )}
    </button>
  )
}

export default ThreadSummary
