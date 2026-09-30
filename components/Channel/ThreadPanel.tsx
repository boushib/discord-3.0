'use client'

import { MessagesSquare, X } from 'lucide-react'
import { useEffect } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { markRead, setOpenThread } from '../../store'
import { findChannel, selectMessages } from '../../store/selectors'
import MessageBox from '../MessageBox'
import Tooltip from '../Tooltip'
import MessageList from './MessageList'
import styles from './ThreadPanel.module.sass'

/** Side panel showing a thread's conversation next to its parent channel */
const ThreadPanel = ({ threadId }: { threadId: string }) => {
  const dispatch = useAppDispatch()
  const context = useSelector(s => findChannel(s, threadId))
  const count = useSelector(s => selectMessages(s, threadId).length)

  useEffect(() => {
    dispatch(markRead(threadId))
  }, [dispatch, threadId, count])

  if (!context || context.kind !== 'server' || !context.thread) return null

  return (
    <aside className={styles.panel} aria-label={`Thread: ${context.thread.name}`}>
      <header className={styles.header}>
        <MessagesSquare size={20} className={styles.icon} />
        <h2 className={styles.name}>{context.thread.name}</h2>
        <Tooltip label="Close" placement="bottom">
          <button type="button" className={styles.close} aria-label="Close thread" onClick={() => dispatch(setOpenThread(null))}>
            <X size={20} />
          </button>
        </Tooltip>
      </header>
      <MessageList key={`thread-list-${threadId}`} channelId={threadId} context={context} ignoreSearch />
      <MessageBox key={`thread-box-${threadId}`} channelId={threadId} context={context} />
    </aside>
  )
}

export default ThreadPanel
