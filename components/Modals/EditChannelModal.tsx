'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { serverHref } from '../../lib/routes'
import { closeModal, deleteChannel, updateChannel } from '../../store'
import ChannelTypeIcon from '../ChannelTypeIcon'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const EditChannelModal = ({ serverId, channelId }: { serverId: string; channelId: string }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const channel = useSelector(s => s.servers.byId[serverId]?.channels.find(c => c.id === channelId))
  const [name, setName] = useState(channel?.name ?? '')
  const [topic, setTopic] = useState(channel?.topic ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const close = () => dispatch(closeModal())

  if (!channel) return null
  const slug = (value: string) => (channel.type === 'voice' ? value : value.toLowerCase().replace(/\s/g, '-'))

  if (confirmDelete) {
    return (
      <Modal
        title="Delete Channel"
        subtitle={
          <>
            Are you sure you want to delete <strong>#{channel.name}</strong>? This cannot be undone.
          </>
        }
        onClose={() => setConfirmDelete(false)}
        footer={
          <>
            <Button variant="link" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                close()
                router.push(serverHref(serverId))
                dispatch(deleteChannel({ serverId, channelId }))
              }}
            >
              Delete Channel
            </Button>
          </>
        }
      />
    )
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    dispatch(updateChannel({ serverId, channelId, changes: { name: slug(name.trim()), topic: topic.trim() || undefined } }))
    close()
  }

  return (
    <Modal
      title="Edit Channel"
      onClose={close}
      size="medium"
      footer={
        <>
          <Button variant="danger" onClick={() => setConfirmDelete(true)} className={styles.back}>
            Delete Channel
          </Button>
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="edit-channel" disabled={!name.trim()}>
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-channel" onSubmit={save}>
        <label className={styles.field}>
          <span className={styles.label}>Channel Name</span>
          <span className={styles.prefixed}>
            <ChannelTypeIcon type={channel.type} size={16} />
            <input autoFocus value={name} maxLength={100} onChange={e => setName(slug(e.target.value))} />
          </span>
        </label>
        {channel.type !== 'voice' && (
          <label className={styles.field}>
            <span className={styles.label}>Channel Topic</span>
            <input
              value={topic}
              maxLength={1024}
              placeholder="Let everyone know how to use this channel!"
              onChange={e => setTopic(e.target.value)}
            />
          </label>
        )}
      </form>
    </Modal>
  )
}

export default EditChannelModal
