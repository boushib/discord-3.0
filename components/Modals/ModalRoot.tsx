'use client'

import { useSelector } from '../../hooks'
import ServerSettings from '../ServerSettings'
import Settings from '../Settings'
import CreateChannelModal from './CreateChannelModal'
import CreateDMModal from './CreateDMModal'
import CreateServerModal from './CreateServerModal'
import DeleteMessageModal from './DeleteMessageModal'
import DownloadModal from './DownloadModal'
import EditChannelModal from './EditChannelModal'
import ForwardModal from './ForwardModal'
import GiftModal from './GiftModal'
import InviteModal from './InviteModal'
import LeaveServerModal from './LeaveServerModal'
import PollModal from './PollModal'
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
    case 'poll':
      return <PollModal channelId={modal.channelId} />
    case 'forward':
      return <ForwardModal channelId={modal.channelId} messageId={modal.messageId} />
    case 'gift':
      return <GiftModal channelId={modal.channelId} />
    case 'invite':
      return <InviteModal serverId={modal.serverId} />
    case 'leaveServer':
      return <LeaveServerModal serverId={modal.serverId} />
    case 'createDM':
      return <CreateDMModal />
    case 'quickSwitcher':
      return <QuickSwitcher />
    case 'download':
      return <DownloadModal />
    case 'shortcuts':
      return <ShortcutsModal />
    case 'serverSettings':
      return <ServerSettings serverId={modal.serverId} />
    case 'settings':
      return <Settings />
    case 'deleteMessage':
      return <DeleteMessageModal channelId={modal.channelId} messageId={modal.messageId} />
    default:
      return null
  }
}

export default ModalRoot
