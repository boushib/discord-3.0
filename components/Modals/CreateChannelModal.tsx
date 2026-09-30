'use client'

import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { channelHref } from '../../lib/routes'
import type { ChannelType } from '../../models'
import { closeModal, createChannel } from '../../store'
import ChannelTypeIcon from '../ChannelTypeIcon'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const TYPES: { type: ChannelType; label: string; description: string }[] = [
  { type: 'text', label: 'Text', description: 'Send messages, images, GIFs, emoji, opinions, and puns' },
  { type: 'voice', label: 'Voice', description: 'Hang out together with voice, video, and screen share' },
  { type: 'announcement', label: 'Announcement', description: 'Important updates for people in and out of the server' },
]

const CreateChannelModal = ({ serverId, categoryId }: { serverId: string; categoryId: string | null }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const category = useSelector(s => s.servers.byId[serverId]?.categories.find(c => c.id === categoryId))
  const [type, setType] = useState<ChannelType>('text')
  const [name, setName] = useState('')
  const close = () => dispatch(closeModal())

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const action = dispatch(createChannel({ serverId, name, type, categoryId }))
    close()
    if (type !== 'voice') router.push(channelHref(serverId, action.payload.channel.id))
  }

  return (
    <Modal
      title="Create Channel"
      subtitle={category ? `in ${category.name}` : undefined}
      onClose={close}
      size="medium"
      footer={
        <>
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="create-channel" disabled={!name.trim()}>
            Create Channel
          </Button>
        </>
      }
    >
      <form id="create-channel" onSubmit={create}>
        <span className={styles.label}>Channel Type</span>
        <div className={styles.types} role="radiogroup">
          {TYPES.map(t => (
            <label key={t.type} className={classNames(styles.type, type === t.type && styles.typeActive)}>
              <input
                type="radio"
                name="type"
                className="sr-only"
                checked={type === t.type}
                onChange={() => setType(t.type)}
              />
              <ChannelTypeIcon type={t.type} size={24} className={styles.typeIcon} />
              <span className={styles.typeText}>
                <span className={styles.typeLabel}>{t.label}</span>
                <span className={styles.typeDescription}>{t.description}</span>
              </span>
              <span className={styles.radio} />
            </label>
          ))}
        </div>
        <label className={styles.field}>
          <span className={styles.label}>Channel Name</span>
          <span className={styles.prefixed}>
            <ChannelTypeIcon type={type} size={16} />
            <input
              autoFocus
              value={name}
              placeholder="new-channel"
              maxLength={100}
              onChange={e =>
                setName(type === 'voice' ? e.target.value : e.target.value.toLowerCase().replace(/\s/g, '-'))
              }
            />
          </span>
        </label>
      </form>
    </Modal>
  )
}

export default CreateChannelModal
