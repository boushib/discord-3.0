'use client'

import { useSelector } from '../../hooks'
import Settings from '../Settings'
import CreateChannelModal from './CreateChannelModal'
import CreateServerModal from './CreateServerModal'
import DeleteMessageModal from './DeleteMessageModal'
import EditChannelModal from './EditChannelModal'
import InviteModal from './InviteModal'
import LeaveServerModal from './LeaveServerModal'
import QuickSwitcher from './QuickSwitcher'

const ModalRoot = () => {
  const modal = useSelector(s => s.ui.modal)
  if (!modal) return null

  switch (modal.type) {
    case 'createServer':
      return <CreateServerModal />
    case 'createChannel':
      return <CreateChannelModal serverId={modal.serverId} categoryId={modal.categoryId} />
    case 'editChannel':
      return <EditChannelModal serverId={modal.serverId} channelId={modal.channelId} />
    case 'invite':
      return <InviteModal serverId={modal.serverId} />
    case 'leaveServer':
      return <LeaveServerModal serverId={modal.serverId} />
    case 'quickSwitcher':
      return <QuickSwitcher />
    case 'settings':
      return <Settings />
    case 'deleteMessage':
      return <DeleteMessageModal channelId={modal.channelId} messageId={modal.messageId} />
    default:
      return null
  }
}

export default ModalRoot
