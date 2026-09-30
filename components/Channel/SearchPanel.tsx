'use client'

import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatTimestamp } from '../../lib/format'
import { channelHref, dmHref } from '../../lib/routes'
import { isEmptyQuery, matchMessage, parseQuery } from '../../lib/search'
import type { Message } from '../../models'
import { setOpenThread, setSearchOpen } from '../../store'
import type { ChannelContext } from '../../store/selectors'
import { displayNameIn, roleColorIn } from '../../store/selectors'
import Avatar from '../Avatar'
import Markdown from '../Markdown'
import styles from './SearchPanel.module.sass'

interface Scope {
  id: string
  label: string
  threadOf?: string
}

const SearchPanel = ({ channelId, context }: { channelId: string; context: ChannelContext }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const query = useSelector(s => s.ui.search)
  const messages = useSelector(s => s.messages)
  const users = useSelector(s => s.users.byId)
  const threads = useSelector(s => s.threads)
  const server = context.kind === 'server' ? context.server : undefined

  // Search the whole server (channels + threads), or just this DM
  const scopes = useMemo<Scope[]>(() => {
    if (!server) return [{ id: channelId, label: context.kind === 'dm' ? `@${context.recipient.displayName}` : '' }]
    const channels = server.channels.filter(c => c.type !== 'voice').map(c => ({ id: c.id, label: c.name }))
    const threadScopes = Object.values(threads)
      .filter(t => t.serverId === server.id)
      .map(t => ({ id: t.id, label: t.name, threadOf: t.parentChannelId }))
    return [...channels, ...threadScopes]
  }, [server, threads, channelId, context])

  const parsed = parseQuery(query)
  const results: { message: Message; scope: Scope }[] = isEmptyQuery(parsed)
    ? []
    : scopes
        .flatMap(scope =>
          (messages[scope.id] ?? [])
            .filter(m => matchMessage(m, parsed, users, scope.label))
            .map(message => ({ message, scope }))
        )
        .sort((a, b) => b.message.createdAt - a.message.createdAt)
        .slice(0, 50)

  const jump = ({ message, scope }: { message: Message; scope: Scope }) => {
    const target = scope.threadOf ?? scope.id
    if (target !== channelId) {
      router.push(server ? channelHref(server.id, target) : dmHref(target))
    }
    if (scope.threadOf) dispatch(setOpenThread(scope.id))
    setTimeout(() => {
      const el = document.getElementById(`message-${message.id}`)
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el?.animate([{ backgroundColor: 'rgba(88, 101, 242, .25)' }, { backgroundColor: 'transparent' }], { duration: 1600 })
    }, target === channelId ? 0 : 400)
  }

  return (
    <aside className={styles.panel} aria-label="Search results">
      <header className={styles.header}>
        <Search size={18} />
        <h2>
          {results.length === 50 ? '50+' : results.length} Result{results.length === 1 ? '' : 's'}
        </h2>
        <button type="button" aria-label="Close search" onClick={() => dispatch(setSearchOpen(false))}>
          <X size={20} />
        </button>
      </header>
      <div className={`${styles.list} scroller`}>
        {results.map(result => {
          const author = users[result.message.authorId]
          return (
            <div key={result.message.id} className={styles.result}>
              {result.scope.label && (
                <div className={styles.where}>
                  {server ? (result.scope.threadOf ? '🧵 ' : '#') : ''}
                  {result.scope.label}
                </div>
              )}
              <div className={styles.card}>
                <Avatar user={author} size={32} />
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <strong style={{ color: roleColorIn(server, author.id) }}>{displayNameIn(server, author)}</strong>
                    <span>{formatTimestamp(result.message.createdAt)}</span>
                  </div>
                  <div className={styles.text}>
                    {result.message.content ? (
                      <Markdown content={result.message.content} />
                    ) : (
                      <em>
                        {result.message.poll
                          ? `Poll: ${result.message.poll.question}`
                          : result.message.attachments?.length
                            ? 'Attachment'
                            : 'Sticker'}
                      </em>
                    )}
                  </div>
                </div>
                <button type="button" className={styles.jump} onClick={() => jump(result)}>
                  Jump
                </button>
              </div>
            </div>
          )
        })}
        {results.length === 0 && (
          <div className={styles.empty}>
            <Search size={40} />
            <p>No results found. Try different keywords or filters like from:kai or has:link.</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SearchPanel
