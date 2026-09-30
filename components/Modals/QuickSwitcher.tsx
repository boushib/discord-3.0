'use client'

import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { channelHref, dmHref, serverHref } from '../../lib/routes'
import { closeModal, dmIdFor, groupName, openDM } from '../../store'
import { selectIsUnread } from '../../store/selectors'
import Avatar from '../Avatar'
import ChannelTypeIcon from '../ChannelTypeIcon'
import ServerIcon from '../ServerRail/ServerIcon'
import styles from './QuickSwitcher.module.sass'

type Result =
  | { kind: 'channel'; id: string; label: string; hint: string; serverId: string; type: 'text' | 'announcement' | 'voice'; unread: boolean }
  | { kind: 'user'; id: string; label: string; hint: string }
  | { kind: 'server'; id: string; label: string; hint: string }
  | { kind: 'group'; id: string; label: string; hint: string }

/** Lower is better; -1 means no match */
const score = (label: string, query: string) => {
  const l = label.toLowerCase()
  if (!query) return 0
  if (l.startsWith(query)) return 0
  const idx = l.indexOf(query)
  if (idx >= 0) return 1 + idx / 100
  // Subsequence match: "dgen" -> "dapper-general"
  let i = 0
  for (const char of l) if (char === query[i]) i++
  return i === query.length ? 3 : -1
}

const QuickSwitcher = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const state = useSelector(s => s)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const close = () => dispatch(closeModal())

  const results = useMemo(() => {
    const prefix = /^[#@*]/.test(query) ? query[0] : ''
    const q = query.slice(prefix ? 1 : 0).trim().toLowerCase()
    const all: Result[] = []

    if (!prefix || prefix === '#') {
      for (const serverId of state.servers.order) {
        const server = state.servers.byId[serverId]
        for (const c of server.channels) {
          if (c.type === 'voice') continue
          all.push({
            kind: 'channel',
            id: c.id,
            label: c.name,
            hint: server.name,
            serverId,
            type: c.type,
            unread: selectIsUnread(state, c.id),
          })
        }
      }
    }
    if (!prefix || prefix === '@') {
      const known = new Set([
        ...state.dms.map(d => d.recipientId),
        ...state.users.relationships.filter(r => r.type === 'friend').map(r => r.userId),
      ])
      for (const user of Object.values(state.users.byId)) {
        if (user.id === CURRENT_USER_ID || (!known.has(user.id) && !q)) continue
        all.push({ kind: 'user', id: user.id, label: user.displayName, hint: user.username })
      }
    }
    if (!prefix || prefix === '@') {
      for (const group of state.groups) {
        all.push({
          kind: 'group',
          id: group.id,
          label: groupName(group, id => state.users.byId[id]?.displayName ?? 'Unknown'),
          hint: `${group.memberIds.length + 1} members`,
        })
      }
    }
    if (!prefix || prefix === '*') {
      for (const serverId of state.servers.order) {
        const server = state.servers.byId[serverId]
        all.push({ kind: 'server', id: serverId, label: server.name, hint: `${server.members.length} members` })
      }
    }

    if (!q) {
      // Without a query, surface conversations with activity first
      return all
        .sort((a, b) => Number(b.kind === 'channel' && b.unread) - Number(a.kind === 'channel' && a.unread))
        .slice(0, 12)
    }
    return all
      .map(r => ({ r, s: Math.min(...[r.label, r.kind === 'user' ? r.hint : ''].map(t => (t ? score(t, q) : -1)).filter(x => x >= 0), Infinity) }))
      .filter(x => x.s !== Infinity)
      .sort((a, b) => a.s - b.s)
      .slice(0, 12)
      .map(x => x.r)
  }, [query, state])

  const active = Math.min(selected, Math.max(results.length - 1, 0))

  const go = (r: Result) => {
    close()
    if (r.kind === 'channel') router.push(channelHref(r.serverId, r.id))
    else if (r.kind === 'server') router.push(serverHref(r.id))
    else if (r.kind === 'group') router.push(dmHref(r.id))
    else {
      dispatch(openDM(r.id))
      router.push(dmHref(dmIdFor(r.id)))
    }
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={close}>
      <div className={styles.switcher} role="dialog" aria-label="Quick switcher" onMouseDown={e => e.stopPropagation()}>
        <input
          autoFocus
          className={styles.input}
          placeholder="Where would you like to go?"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setSelected(0)
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              const delta = e.key === 'ArrowDown' ? 1 : -1
              setSelected((active + delta + results.length) % Math.max(results.length, 1))
            } else if (e.key === 'Enter' && results[active]) {
              go(results[active])
            } else if (e.key === 'Escape') {
              close()
            }
          }}
        />
        <div className={styles.heading}>{query ? 'Results' : 'Previous channels'}</div>
        <div className={`${styles.results} scroller`} role="listbox">
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.id}`}
              type="button"
              role="option"
              aria-selected={i === active}
              className={classNames(styles.result, i === active && styles.resultActive)}
              onMouseEnter={() => setSelected(i)}
              onClick={() => go(r)}
            >
              <span className={styles.icon}>
                {r.kind === 'channel' && <ChannelTypeIcon type={r.type} size={20} />}
                {r.kind === 'user' && (
                  <Avatar user={state.users.byId[r.id]} size={20} />
                )}
                {r.kind === 'group' && (
                  <Avatar user={state.users.byId[state.groups.find(g => g.id === r.id)!.memberIds[0]]} size={20} />
                )}
                {r.kind === 'server' && (
                  <span className={styles.serverIcon}>
                    <ServerIcon server={state.servers.byId[r.id]} />
                  </span>
                )}
              </span>
              <span className={classNames(styles.label, r.kind === 'channel' && r.unread && styles.unread)}>
                {r.label}
              </span>
              {r.kind === 'user' && <span className={styles.username}>{r.hint}</span>}
              {r.kind !== 'user' && <span className={styles.hint}>{r.hint}</span>}
            </button>
          ))}
          {results.length === 0 && <div className={styles.empty}>Can’t find what you’re looking for?</div>}
        </div>
        <p className={styles.protip}>
          <strong>Protip:</strong> Start searches with <kbd>@</kbd> <kbd>#</kbd> <kbd>*</kbd> to narrow results.
        </p>
      </div>
    </div>,
    document.body
  )
}

export default QuickSwitcher
