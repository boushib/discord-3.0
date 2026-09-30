'use client'

import classNames from 'classnames'
import { Plus, ShoppingBag, Sparkles, UsersRound, X } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useSelector } from '../../hooks'
import { dmHref } from '../../lib/routes'
import type { DMChannel, GroupDM } from '../../models'
import { closeDM, groupName, leaveGroup, openModal } from '../../store'
import { selectMentionCount } from '../../store/selectors'
import Avatar, { GroupAvatar } from '../Avatar'
import Tooltip from '../Tooltip'
import UserPanel from '../UserPanel'
import VoicePanel from '../UserPanel/VoicePanel'
import styles from './DMSidebar.module.sass'

const DMRow = ({ dm, active }: { dm: DMChannel; active: boolean }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useSelector(s => s.users.byId[dm.recipientId])
  const mentions = useSelector(s => (active ? 0 : selectMentionCount(s, dm.id)))

  return (
    <Link
      href={dmHref(dm.id)}
      className={classNames(styles.dm, active && styles.active, mentions > 0 && styles.unread)}
    >
      <Avatar user={user} size={32} status={user.status} ringColor="var(--bg-secondary)" />
      <span className={styles.dmText}>
        <span className={styles.dmName}>{user.displayName}</span>
        {user.customStatus && user.status !== 'offline' && (
          <span className={styles.dmStatus}>{user.customStatus}</span>
        )}
      </span>
      {mentions > 0 && <span className={styles.badge}>{mentions}</span>}
      <button
        type="button"
        className={styles.close}
        aria-label="Close DM"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(closeDM(dm.id))
          if (active) router.push('/channels/@me')
        }}
      >
        <X size={16} />
      </button>
    </Link>
  )
}

const GroupRow = ({ group, active }: { group: GroupDM; active: boolean }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const users = useSelector(s => s.users.byId)
  const mentions = useSelector(s => (active ? 0 : selectMentionCount(s, group.id)))
  const members = group.memberIds.map(id => users[id]).filter(Boolean)

  return (
    <Link
      href={dmHref(group.id)}
      className={classNames(styles.dm, active && styles.active, mentions > 0 && styles.unread)}
    >
      <GroupAvatar members={members} size={32} />
      <span className={styles.dmText}>
        <span className={styles.dmName}>{groupName(group, id => users[id]?.displayName ?? 'Unknown')}</span>
        <span className={styles.dmStatus}>{group.memberIds.length + 1} Members</span>
      </span>
      {mentions > 0 && <span className={styles.badge}>{mentions}</span>}
      <button
        type="button"
        className={styles.close}
        aria-label="Leave Group"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(leaveGroup(group.id))
          if (active) router.push('/channels/@me')
        }}
      >
        <X size={16} />
      </button>
    </Link>
  )
}

const DMSidebar = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { channelId } = useParams<{ channelId?: string }>()
  const dms = useSelector(s => s.dms)
  const groups = useSelector(s => s.groups)
  const incoming = useSelector(s => s.users.relationships.filter(r => r.type === 'incoming').length)
  const openSwitcher = () => dispatch(openModal({ type: 'quickSwitcher' }))

  return (
    <aside className={styles.sidebar} aria-label="Direct messages" data-panel="nav">
      <div className={styles.searchBar}>
        <button type="button" className={styles.search} onClick={openSwitcher}>
          Find or start a conversation
        </button>
      </div>
      <div className={`${styles.scroller} scroller`}>
        <Link
          href="/channels/@me"
          className={classNames(styles.nav, decodeURIComponent(pathname).endsWith('/@me') && styles.active)}
        >
          <UsersRound size={22} />
          <span>Friends</span>
          {incoming > 0 && <span className={styles.badge}>{incoming}</span>}
        </Link>
        <Link href="/channels/@me/nitro" className={classNames(styles.nav, channelId === 'nitro' && styles.active)}>
          <Sparkles size={22} />
          <span>Nitro</span>
        </Link>
        <Link href="/channels/@me/shop" className={classNames(styles.nav, channelId === 'shop' && styles.active)}>
          <ShoppingBag size={22} />
          <span>Shop</span>
          <span className={styles.newTag}>NEW</span>
        </Link>

        <div className={styles.heading}>
          <span>Direct Messages</span>
          <Tooltip label="Create DM">
            <button type="button" aria-label="Create DM" onClick={() => dispatch(openModal({ type: 'createDM' }))}>
              <Plus size={16} />
            </button>
          </Tooltip>
        </div>
        {groups.map(group => (
          <GroupRow key={group.id} group={group} active={group.id === channelId} />
        ))}
        {dms.map(dm => (
          <DMRow key={dm.id} dm={dm} active={dm.id === channelId} />
        ))}
        {dms.length === 0 && groups.length === 0 && <p className={styles.empty}>No direct messages yet.</p>}
      </div>
      <VoicePanel />
      <UserPanel />
    </aside>
  )
}

export default DMSidebar
