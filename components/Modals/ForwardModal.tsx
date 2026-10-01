'use client'

import classNames from 'classnames'
import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch, useSelector } from '../../hooks'
import { closeModal, groupName, sendMessage } from '../../store'
import Avatar, { GroupAvatar } from '../Avatar'
import ChannelTypeIcon from '../ChannelTypeIcon'
import Modal, { Button } from '../Modal'
import ServerIcon from '../ServerRail/ServerIcon'
import styles from './Modals.module.sass'

const MAX_DESTINATIONS = 5

interface Destination {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
}

const ForwardModal = ({ channelId, messageId }: { channelId: string; messageId: string }) => {
  const dispatch = useAppDispatch()
  const message = useSelector(s => s.messages[channelId]?.find(m => m.id === messageId))
  const users = useSelector(s => s.users.byId)
  const dms = useSelector(s => s.dms)
  const groups = useSelector(s => s.groups)
  const servers = useSelector(s => s.servers)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const close = () => dispatch(closeModal())

  const destinations = useMemo<Destination[]>(
    () => [
      ...dms.map(d => ({
        id: d.id,
        label: users[d.recipientId]?.displayName ?? 'Unknown',
        hint: 'Direct Message',
        icon: <Avatar user={users[d.recipientId]} size={24} />,
      })),
      ...groups.map(g => ({
        id: g.id,
        label: groupName(g, id => users[id]?.displayName ?? 'Unknown'),
        hint: 'Group DM',
        icon: <GroupAvatar members={g.memberIds.map(id => users[id]).filter(Boolean)} size={24} />,
      })),
      ...servers.order.flatMap(id => {
        const server = servers.byId[id]
        return server.channels
          .filter(c => c.type !== 'voice')
          .map(c => ({
            id: c.id,
            label: `#${c.name}`,
            hint: server.name,
            icon: (
              <span className={styles.forwardServerIcon}>
                <ServerIcon server={server} />
              </span>
            ),
          }))
      }),
    ],
    [dms, groups, servers, users]
  )

  if (!message) return null
  const q = query.trim().toLowerCase()
  const list = destinations.filter(d => !q || `${d.label} ${d.hint}`.toLowerCase().includes(q)).slice(0, 60)
  const toggle = (id: string) =>
    setSelected(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : sel.length < MAX_DESTINATIONS ? [...sel, id] : sel
    )

  const forward = () => {
    for (const target of selected) {
      dispatch(
        sendMessage({
          channelId: target,
          authorId: CURRENT_USER_ID,
          content: note.trim(),
          forwarded: {
            messageId: message.id,
            channelId: message.channelId,
            authorId: message.authorId,
            content: message.content,
            createdAt: message.createdAt,
            attachments: message.attachments,
            sticker: message.sticker,
          },
        })
      )
    }
    setSent(true)
    setTimeout(close, 900)
  }

  return (
    <Modal
      title="Forward To"
      subtitle="Select where you want to share this message."
      onClose={close}
      size="medium"
      footer={
        <>
          <input
            className={styles.forwardNote}
            placeholder="Add an optional message…"
            value={note}
            maxLength={2000}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && selected.length && forward()}
          />
          <Button onClick={forward} disabled={!selected.length || sent}>
            {sent ? 'Sent!' : selected.length > 1 ? `Send (${selected.length})` : 'Send'}
          </Button>
        </>
      }
    >
      <input
        className={styles.searchInput}
        autoFocus
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className={`${styles.inviteList} scroller`}>
        {list.map(d => {
          const on = selected.includes(d.id)
          return (
            <button key={d.id} type="button" className={styles.pickRow} onClick={() => toggle(d.id)}>
              {d.icon}
              <span className={styles.inviteName}>
                {d.label} <span className={styles.pickUsername}>{d.hint}</span>
              </span>
              <span className={classNames(styles.pickBox, on && styles.pickBoxOn)}>{on && <Check size={14} />}</span>
            </button>
          )
        })}
        {list.length === 0 && <p className={styles.hint}>No matches.</p>}
      </div>
      <div className={styles.forwardPreview}>
        <ChannelTypeIcon type="text" size={14} />
        <span>
          <strong>{users[message.authorId]?.displayName}</strong>:{' '}
          {message.content || (message.attachments?.length ? 'Attachment' : message.sticker ? 'Sticker' : '')}
        </span>
      </div>
    </Modal>
  )
}

export default ForwardModal
