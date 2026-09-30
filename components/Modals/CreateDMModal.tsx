'use client'

import classNames from 'classnames'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { dmHref } from '../../lib/routes'
import { closeModal, createGroup, dmIdFor, openDM } from '../../store'
import Avatar from '../Avatar'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const MAX = 9

const CreateDMModal = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const users = useSelector(s => s.users.byId)
  const friends = useSelector(s => s.users.relationships)
    .filter(r => r.type === 'friend')
    .map(r => users[r.userId])
    .filter(Boolean)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const close = () => dispatch(closeModal())
  const list = friends.filter(u => `${u.displayName} ${u.username}`.toLowerCase().includes(query.toLowerCase()))

  const toggle = (id: string) =>
    setSelected(sel => (sel.includes(id) ? sel.filter(x => x !== id) : sel.length < MAX ? [...sel, id] : sel))

  const create = () => {
    if (!selected.length) return
    close()
    if (selected.length === 1) {
      dispatch(openDM(selected[0]))
      router.push(dmHref(dmIdFor(selected[0])))
    } else {
      const action = dispatch(createGroup(selected))
      router.push(dmHref(action.payload.id))
    }
  }

  return (
    <Modal
      title="Select Friends"
      subtitle={`You can add ${MAX - selected.length} more friend${MAX - selected.length === 1 ? '' : 's'}.`}
      onClose={close}
      size="medium"
      footer={
        <Button onClick={create} disabled={!selected.length}>
          {selected.length > 1 ? 'Create Group DM' : 'Create DM'}
        </Button>
      }
    >
      <input
        className={styles.searchInput}
        autoFocus
        placeholder="Type the username of a friend"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className={`${styles.inviteList} scroller`}>
        {list.map(user => {
          const on = selected.includes(user.id)
          return (
            <button key={user.id} type="button" className={styles.pickRow} onClick={() => toggle(user.id)}>
              <Avatar user={user} size={32} status={user.status} ringColor="var(--bg-primary)" />
              <span className={styles.inviteName}>
                {user.displayName} <span className={styles.pickUsername}>{user.username}</span>
              </span>
              <span className={classNames(styles.pickBox, on && styles.pickBoxOn)}>{on && <Check size={14} />}</span>
            </button>
          )
        })}
        {list.length === 0 && <p className={styles.hint}>No friends found.</p>}
      </div>
    </Modal>
  )
}

export default CreateDMModal
