'use client'

import { useAppDispatch, useSelector } from '../../hooks'
import { closeModal, deleteMessage } from '../../store'
import { findChannel } from '../../store/selectors'
import Message from '../Message'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const DeleteMessageModal = ({ channelId, messageId }: { channelId: string; messageId: string }) => {
  const dispatch = useAppDispatch()
  const message = useSelector(s => s.messages[channelId]?.find(m => m.id === messageId))
  const context = useSelector(s => findChannel(s, channelId))
  const close = () => dispatch(closeModal())

  if (!message) return null

  const confirm = () => {
    dispatch(deleteMessage({ channelId, messageId }))
    close()
  }

  return (
    <Modal
      title="Delete Message"
      subtitle="Are you sure you want to delete this message?"
      onClose={close}
      footer={
        <>
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirm} autoFocus>
            Delete
          </Button>
        </>
      }
    >
      <div className={styles.messagePreview}>
        <Message
          message={{ ...message, reactions: [] }}
          server={context?.kind === 'server' ? context.server : undefined}
          grouped={false}
          preview
        />
      </div>
      <p className={styles.protip}>
        <strong>Protip:</strong> You can hold down Shift when clicking <strong>delete message</strong> to bypass this
        confirmation entirely.
      </p>
    </Modal>
  )
}

export default DeleteMessageModal
