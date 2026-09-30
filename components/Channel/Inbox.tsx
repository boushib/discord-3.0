'use client'

import classNames from 'classnames'
import { AtSign, CheckCheck, Inbox as InboxIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import { channelHref, dmHref } from '../../lib/routes'
import { markRead } from '../../store'
import { findChannel, selectIsUnread, selectMentionCount, selectRecentMentions } from '../../store/selectors'
import Avatar from '../Avatar'
import Markdown from '../Markdown'
import styles from './Inbox.module.sass'

const Inbox = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [tab, setTab] = useState<'mentions' | 'unreads'>('mentions')
  const state = useSelector(s => s)
  const mentions = selectRecentMentions(state)

  const unreads = [
    ...state.dms.map(d => d.id),
    ...state.servers.order.flatMap(id => state.servers.byId[id].channels.filter(c => c.type !== 'voice').map(c => c.id)),
  ].filter(id => selectIsUnread(state, id) || selectMentionCount(state, id) > 0)

  const hrefFor = (channelId: string) => {
    const context = findChannel(state, channelId)
    if (!context) return null
    return context.kind === 'dm' ? dmHref(channelId) : channelHref(context.server.id, channelId)
  }
  const labelFor = (channelId: string) => {
    const context = findChannel(state, channelId)
    if (!context) return ''
    return context.kind === 'dm' ? `@${context.recipient.displayName}` : `#${context.channel.name} · ${context.server.name}`
  }

  const jump = (channelId: string, messageId?: string) => {
    const href = hrefFor(channelId)
    if (!href) return
    onClose()
    router.push(href)
    if (messageId) {
      // Wait for the channel to render, then bring the message into view
      setTimeout(() => {
        const el = document.getElementById(`message-${messageId}`)
        el?.scrollIntoView({ block: 'center' })
        el?.animate([{ backgroundColor: 'rgba(88, 101, 242, .25)' }, { backgroundColor: 'transparent' }], {
          duration: 1600,
        })
      }, 400)
    }
  }

  return (
    <div className={styles.inbox}>
      <header className={styles.header}>
        <InboxIcon size={20} />
        <h2>Inbox</h2>
        {tab === 'unreads' && unreads.length > 0 && (
          <button type="button" className={styles.markAll} onClick={() => unreads.forEach(id => dispatch(markRead(id)))}>
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </header>
      <nav className={styles.tabs}>
        {(['mentions', 'unreads'] as const).map(t => (
          <button
            key={t}
            type="button"
            className={classNames(styles.tab, tab === t && styles.tabActive)}
            onClick={() => setTab(t)}
          >
            {t === 'mentions' ? 'Mentions' : `Unreads${unreads.length ? ` (${unreads.length})` : ''}`}
          </button>
        ))}
      </nav>
      <div className={`${styles.list} scroller`}>
        {tab === 'mentions' ? (
          mentions.length ? (
            mentions.map(m => {
              const author = state.users.byId[m.authorId]
              return (
                <button key={m.id} type="button" className={styles.item} onClick={() => jump(m.channelId, m.id)}>
                  <div className={styles.where}>{labelFor(m.channelId)}</div>
                  <div className={styles.message}>
                    <Avatar user={author} size={32} />
                    <div className={styles.content}>
                      <div className={styles.meta}>
                        <strong>{author.displayName}</strong> <span>{formatTimestamp(m.createdAt)}</span>
                      </div>
                      <div className={styles.text}>
                        <Markdown content={m.content} />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className={styles.empty}>
              <AtSign size={40} />
              <p>Nobody has mentioned you yet. When someone @mentions you, it’ll show up here.</p>
            </div>
          )
        ) : unreads.length ? (
          unreads.map(id => (
            <button key={id} type="button" className={styles.unread} onClick={() => jump(id)}>
              <span>{labelFor(id)}</span>
              {selectMentionCount(state, id) > 0 && <span className={styles.badge}>{selectMentionCount(state, id)}</span>}
            </button>
          ))
        ) : (
          <div className={styles.empty}>
            <CheckCheck size={40} />
            <p>You’re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inbox
