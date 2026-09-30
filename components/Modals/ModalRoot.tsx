'use client'

import { useSelector } from '../../hooks'
import DeleteMessageModal from './DeleteMessageModal'

const ModalRoot = () => {
  const modal = useSelector(s => s.ui.modal)
  if (!modal) return null

  switch (modal.type) {
    case 'deleteMessage':
      return <DeleteMessageModal channelId={modal.channelId} messageId={modal.messageId} />
    default:
      return null
  }
}

export default ModalRoot
