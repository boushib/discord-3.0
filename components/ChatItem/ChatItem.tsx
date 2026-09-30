'use client'

import { useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import type { Message } from '../../models'
import Avatar from '../Avatar'
import styles from './ChatItem.module.sass'

const ChatItem = ({ message }: { message: Message }) => {
  const author = useSelector(s => s.users.byId[message.authorId])
  return (
    <div className={styles['chat-item']}>
      <Avatar user={author} />
      <div>
        <div className={styles['chat-item__header']}>
          <div className={styles['chat-item__username']}>{author.displayName}</div>
          <div className={styles['chat-item__time']}>{formatTimestamp(message.createdAt)}</div>
        </div>
        <div className={styles['chat-item__message']}>{message.content}</div>
      </div>
    </div>
  )
}

export default ChatItem
