'use client'

import { useSelector } from '../../hooks'
import CreateChannelModal from './CreateChannelModal'
import CreateServerModal from './CreateServerModal'
import DeleteMessageModal from './DeleteMessageModal'
import InviteModal from './InviteModal'
import LeaveServerModal from './LeaveServerModal'

const ModalRoot = () => {
  const modal = useSelector(s => s.ui.modal)
  if (!modal) return null

  switch (modal.type) {
    case 'createServer':
      return <CreateServerModal />
    case 'createChannel':
      return <CreateChannelModal serverId={modal.serverId} categoryId={modal.categoryId} />
    case 'invite':
      return <InviteModal serverId={modal.serverId} />
    case 'leaveServer':
      return <LeaveServerModal serverId={modal.serverId} />
    case 'deleteMessage':
      return <DeleteMessageModal channelId={modal.channelId} messageId={modal.messageId} />
    default:
      return null
  }
}

export default ModalRoot
