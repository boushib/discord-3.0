'use client'

import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { closeModal, dmIdFor, openDM, sendMessage } from '../../store'
import Avatar from '../Avatar'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const inviteCode = (serverId: string) => {
  let hash = 0
  for (const char of serverId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash.toString(36).padStart(7, 'x').slice(0, 8)
}

const InviteModal = ({ serverId }: { serverId: string }) => {
  const dispatch = useAppDispatch()
  const server = useSelector(s => s.servers.byId[serverId])
  const users = useSelector(s => s.users.byId)
  const friends = useSelector(s => s.users.relationships).filter(r => r.type === 'friend')
  const [copied, setCopied] = useState(false)
  const [invited, setInvited] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const close = () => dispatch(closeModal())

  if (!server) return null
  const link = `https://discord.gg/${inviteCode(serverId)}`
  const list = friends
    .map(r => users[r.userId])
    .filter(u => u && u.displayName.toLowerCase().includes(query.toLowerCase()))

  const invite = (userId: string) => {
    dispatch(openDM(userId))
    dispatch(
      sendMessage({
        channelId: dmIdFor(userId),
        authorId: CURRENT_USER_ID,
        content: `Join me in **${server.name}**! ${link}`,
      })
    )
    setInvited(ids => [...ids, userId])
  }

  return (
    <Modal title={`Invite friends to ${server.name}`} onClose={close} size="medium">
      <input
        className={styles.searchInput}
        placeholder="Search for friends"
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
      />
      <div className={`${styles.inviteList} scroller`}>
        {list.map(user => (
          <div key={user.id} className={styles.inviteRow}>
            <Avatar user={user} size={32} />
            <span className={styles.inviteName}>{user.displayName}</span>
            <Button
              variant={invited.includes(user.id) ? 'link' : 'success'}
              disabled={invited.includes(user.id)}
              onClick={() => invite(user.id)}
              className={styles.inviteButton}
            >
              {invited.includes(user.id) ? 'Sent' : 'Invite'}
            </Button>
          </div>
        ))}
        {list.length === 0 && <p className={styles.hint}>No friends found.</p>}
      </div>
      <span className={styles.label}>Or, send a server invite link to a friend</span>
      <div className={styles.copyField}>
        <input readOnly value={link} onFocus={e => e.currentTarget.select()} />
        <Button
          variant={copied ? 'success' : 'brand'}
          onClick={() => {
            navigator.clipboard?.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <p className={styles.hint}>Your invite link expires in 7 days.</p>
    </Modal>
  )
}

export default InviteModal
