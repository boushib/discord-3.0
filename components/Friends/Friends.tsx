'use client'

import classNames from 'classnames'
import { Check, Ellipsis, MessageCircle, Search, UsersRound, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { STATUS_LABELS } from '../../constants'
import { useAppDispatch, usePopover, useSelector } from '../../hooks'
import { dmHref, ME } from '../../lib/routes'
import type { Relationship, User } from '../../models'
import { acceptFriend, blockUser, dmIdFor, openDM, removeRelationship } from '../../store'
import Avatar from '../Avatar'
import MobileNavButton from '../MobileNavButton'
import Popover, { Menu, MenuItem } from '../Popover'
import Tooltip from '../Tooltip'
import { useMedia } from '../Voice'
import ActiveNow from './ActiveNow'
import AddFriend from './AddFriend'
import styles from './Friends.module.sass'

type Tab = 'online' | 'all' | 'pending' | 'blocked' | 'add'

const TABS: { id: Exclude<Tab, 'add'>; label: string }[] = [
  { id: 'online', label: 'Online' },
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'blocked', label: 'Blocked' },
]

const EMPTY: Record<Exclude<Tab, 'add'>, string> = {
  online: 'No one’s around to play with Wumpus.',
  all: 'Wumpus is waiting on friends. You don’t have to though!',
  pending: 'There are no pending friend requests. Here’s Wumpus for now.',
  blocked: 'You can’t unblock the Wumpus.',
}

const ActionButton = ({
  label,
  danger,
  success,
  children,
  ...props
}: { label: string; danger?: boolean; success?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Tooltip label={label}>
    <button
      type="button"
      aria-label={label}
      className={classNames(styles.action, danger && styles.actionDanger, success && styles.actionSuccess)}
      {...props}
    >
      {children}
    </button>
  </Tooltip>
)

const FriendRow = ({ user, relationship }: { user: User; relationship: Relationship }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const more = usePopover()
  const media = useMedia()

  const message = () => {
    dispatch(openDM(user.id))
    router.push(dmHref(dmIdFor(user.id)))
  }

  const call = async (video: boolean) => {
    more.close()
    message()
    media.join(ME, dmIdFor(user.id))
    if (video && !media.camera) await media.toggleCamera()
  }

  const subtitle =
    relationship.type === 'incoming'
      ? 'Incoming Friend Request'
      : relationship.type === 'outgoing'
        ? 'Outgoing Friend Request'
        : relationship.type === 'blocked'
          ? 'Blocked'
          : user.customStatus && user.status !== 'offline'
            ? user.customStatus
            : user.status === 'offline'
              ? 'Offline'
              : STATUS_LABELS[user.status]

  return (
    <div
      className={styles.row}
      onClick={relationship.type === 'friend' ? message : undefined}
      role={relationship.type === 'friend' ? 'button' : undefined}
    >
      <Avatar
        user={user}
        size={32}
        status={relationship.type === 'friend' ? user.status : undefined}
        ringColor="var(--bg-primary)"
      />
      <div className={styles.rowText}>
        <div className={styles.rowName}>
          {user.displayName}
          <span className={styles.rowUsername}>{user.username}</span>
        </div>
        <div className={styles.rowStatus}>{subtitle}</div>
      </div>
      <div className={styles.actions} onClick={e => e.stopPropagation()}>
        {relationship.type === 'friend' && (
          <>
            <ActionButton label="Message" onClick={message}>
              <MessageCircle size={20} />
            </ActionButton>
            <ActionButton label="More" {...more.triggerProps}>
              <Ellipsis size={20} />
            </ActionButton>
          </>
        )}
        {relationship.type === 'incoming' && (
          <>
            <ActionButton label="Accept" success onClick={() => dispatch(acceptFriend(user.id))}>
              <Check size={20} />
            </ActionButton>
            <ActionButton label="Ignore" danger onClick={() => dispatch(removeRelationship(user.id))}>
              <X size={20} />
            </ActionButton>
          </>
        )}
        {relationship.type === 'outgoing' && (
          <ActionButton label="Cancel" danger onClick={() => dispatch(removeRelationship(user.id))}>
            <X size={20} />
          </ActionButton>
        )}
        {relationship.type === 'blocked' && (
          <ActionButton label="Unblock" danger onClick={() => dispatch(removeRelationship(user.id))}>
            <X size={20} />
          </ActionButton>
        )}
      </div>
      {more.anchor && (
        <Popover anchor={more.anchor} placement="bottom-end" onClose={more.close}>
          <Menu>
            <MenuItem label="Start Video Call" onClick={() => call(true)} />
            <MenuItem label="Start Voice Call" onClick={() => call(false)} />
            <MenuItem
              danger
              label="Remove Friend"
              onClick={() => {
                more.close()
                dispatch(removeRelationship(user.id))
              }}
            />
            <MenuItem
              danger
              label="Block"
              onClick={() => {
                more.close()
                dispatch(blockUser(user.id))
              }}
            />
          </Menu>
        </Popover>
      )}
    </div>
  )
}

const Friends = () => {
  const [tab, setTab] = useState<Tab>('online')
  const [query, setQuery] = useState('')
  const relationships = useSelector(s => s.users.relationships)
  const users = useSelector(s => s.users.byId)
  const incoming = relationships.filter(r => r.type === 'incoming').length

  const list = relationships
    .filter(r => {
      const user = users[r.userId]
      if (!user) return false
      if (query && !`${user.displayName} ${user.username}`.toLowerCase().includes(query.toLowerCase())) return false
      if (tab === 'online') return r.type === 'friend' && user.status !== 'offline'
      if (tab === 'all') return r.type === 'friend'
      if (tab === 'pending') return r.type === 'incoming' || r.type === 'outgoing'
      return r.type === 'blocked'
    })
    .sort((a, b) => users[a.userId].displayName.localeCompare(users[b.userId].displayName))

  const label =
    tab === 'online' ? 'Online' : tab === 'all' ? 'All friends' : tab === 'pending' ? 'Pending' : 'Blocked'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <MobileNavButton />
        <div className={styles.title}>
          <UsersRound size={22} />
          <h1>Friends</h1>
        </div>
        <span className={styles.divider} />
        <nav className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              className={classNames(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'pending' && incoming > 0 && <span className={styles.badge}>{incoming}</span>}
            </button>
          ))}
          <button
            type="button"
            className={classNames(styles.addTab, tab === 'add' && styles.addTabActive)}
            onClick={() => setTab('add')}
          >
            Add Friend
          </button>
        </nav>
      </header>

      <div className={styles.body}>
        <section className={styles.main}>
          {tab === 'add' ? (
            <AddFriend />
          ) : (
            <>
              <label className={styles.search}>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
                {query ? (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear">
                    <X size={18} />
                  </button>
                ) : (
                  <Search size={18} />
                )}
              </label>
              {list.length ? (
                <>
                  <h2 className={styles.count}>
                    {label} — {list.length}
                  </h2>
                  <div className={`${styles.list} scroller`}>
                    {list.map(r => (
                      <FriendRow key={r.userId} user={users[r.userId]} relationship={r} />
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.empty}>
                  <div className={styles.wumpus}>🦖</div>
                  <p>{query ? `No one matches “${query}”.` : EMPTY[tab]}</p>
                </div>
              )}
            </>
          )}
        </section>
        <ActiveNow />
      </div>
    </div>
  )
}

export default Friends
