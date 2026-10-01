'use client'

import { CornerUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import { channelHref, dmHref } from '../../lib/routes'
import type { Message } from '../../models'
import { contextLabel, findChannel } from '../../store/selectors'
import Attachments from '../Attachments'
import Markdown from '../Markdown'
import { StickerView } from './RichContent'
import styles from './Message.module.sass'

/** "↪ Forwarded" quote block with a link back to the original */
const ForwardedView = ({ forwarded }: { forwarded: NonNullable<Message['forwarded']> }) => {
  const router = useRouter()
  const origin = useSelector(s => findChannel(s, forwarded.channelId))
  const originalExists = useSelector(s => !!s.messages[forwarded.channelId]?.some(m => m.id === forwarded.messageId))

  const jump = () => {
    if (!origin) return
    const target = origin.kind === 'server' && origin.thread ? origin.thread.parentChannelId : forwarded.channelId
    router.push(origin.kind === 'server' ? channelHref(origin.server.id, target) : dmHref(forwarded.channelId))
    setTimeout(() => document.getElementById(`message-${forwarded.messageId}`)?.scrollIntoView({ block: 'center' }), 400)
  }

  return (
    <div className={styles.forwarded}>
      <div className={styles.forwardedLabel}>
        <CornerUpRight size={14} /> Forwarded
      </div>
      <div className={styles.forwardedBody}>
        {forwarded.content && <Markdown content={forwarded.content} />}
        {forwarded.sticker && <StickerView sticker={forwarded.sticker} />}
        {forwarded.attachments && forwarded.attachments.length > 0 && <Attachments attachments={forwarded.attachments} />}
        <div className={styles.forwardedMeta}>
          {origin && originalExists ? (
            <button type="button" onClick={jump}>
              {contextLabel(origin)}
            </button>
          ) : (
            <span>Original message unavailable</span>
          )}
          <span> • {formatTimestamp(forwarded.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default ForwardedView
