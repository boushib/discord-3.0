'use client'

import { useSelector } from '../../hooks'
import Settings from '../Settings'
import CreateChannelModal from './CreateChannelModal'
import CreateServerModal from './CreateServerModal'
import DeleteMessageModal from './DeleteMessageModal'
import DownloadModal from './DownloadModal'
import EditChannelModal from './EditChannelModal'
import GiftModal from './GiftModal'
import InviteModal from './InviteModal'
import LeaveServerModal from './LeaveServerModal'
import QuickSwitcher from './QuickSwitcher'
import ShortcutsModal from './ShortcutsModal'

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
    case 'gift':
      return <GiftModal channelId={modal.channelId} />
    case 'invite':
      return <InviteModal serverId={modal.serverId} />
    case 'leaveServer':
      return <LeaveServerModal serverId={modal.serverId} />
    case 'quickSwitcher':
      return <QuickSwitcher />
    case 'download':
      return <DownloadModal />
    case 'shortcuts':
      return <ShortcutsModal />
    case 'settings':
      return <Settings />
    case 'deleteMessage':
      return <DeleteMessageModal channelId={modal.channelId} messageId={modal.messageId} />
    default:
      return null
  }
}

export default ModalRoot
