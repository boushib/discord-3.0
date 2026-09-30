'use client'

import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { formatShortDate } from '../../lib/format'
import { dmHref } from '../../lib/routes'
import type { Server } from '../../models'
import { dmIdFor, openDM, openModal, sendMessage } from '../../store'
import { displayNameIn, memberOf } from '../../store/selectors'
import { simulateReply } from '../../store/simulate'
import Avatar from '../Avatar'
import DiscordIcon from '../../icons/Discord'
import styles from './ProfileCard.module.sass'

interface Props {
  userId: string
  server?: Server
  onClose: () => void
}

const ProfileCard = ({ userId, server, onClose }: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useSelector(s => s.users.byId[userId])
  const [draft, setDraft] = useState('')
  const member = memberOf(server, userId)
  const roles = server?.roles.filter(r => member?.roleIds.includes(r.id)) ?? []
  const isMe = userId === CURRENT_USER_ID

  const sendDM = () => {
    const content = draft.trim()
    if (!content) return
    const dmId = dmIdFor(userId)
    dispatch(openDM(userId))
    const sent = dispatch(sendMessage({ channelId: dmId, authorId: CURRENT_USER_ID, content }))
    dispatch(simulateReply(dmId, sent.payload.id, content))
    onClose()
    router.push(dmHref(dmId))
  }

  return (
    <div className={styles.card}>
      <div className={styles.banner} style={{ backgroundColor: user.bannerColor ?? '#5865f2' }} />
      <div className={styles.avatar}>
        <Avatar user={user} size={80} status={user.status} ringColor="var(--bg-floating)" />
      </div>
      {user.customStatus && <div className={styles.bubble}>{user.customStatus}</div>}
      <div className={styles.body}>
        <div className={styles.names}>
          <h2 className={styles.displayName}>{displayNameIn(server, user)}</h2>
          <div className={styles.username}>
            {user.username}
            {user.bot && <span className={styles.botTag}>✓ BOT</span>}
            {user.premium && (
              <span className={styles.nitroBadge} title="Nitro subscriber">
                💎
              </span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          {user.bio && (
            <>
              <h3 className={styles.heading}>About Me</h3>
              <p className={styles.bio}>{user.bio}</p>
            </>
          )}
          <h3 className={styles.heading}>Member Since</h3>
          <div className={styles.since}>
            <DiscordIcon width={16} height={12} />
            <span>{formatShortDate(user.createdAt)}</span>
            {member && (
              <>
                <span className={styles.dot} />
                <span>{formatShortDate(member.joinedAt)}</span>
              </>
            )}
          </div>
          {server && (
            <>
              <h3 className={styles.heading}>{roles.length ? `Roles` : 'No Roles'}</h3>
              <div className={styles.roles}>
                {roles.map(role => (
                  <span key={role.id} className={styles.role}>
                    <span className={styles.roleDot} style={{ backgroundColor: role.color ?? 'var(--text-muted)' }} />
                    {role.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {isMe ? (
          <button
            type="button"
            className={styles.edit}
            onClick={() => {
              onClose()
              dispatch(openModal({ type: 'settings' }))
            }}
          >
            <Pencil size={16} /> Edit Profile
          </button>
        ) : (
          <input
            className={styles.message}
            placeholder={`Message @${user.username}`}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendDM()}
            autoFocus
          />
        )}
      </div>
    </div>
  )
}

export default ProfileCard
