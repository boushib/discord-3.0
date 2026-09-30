import ChannelSidebar from '@/components/ChannelSidebar'
import DMSidebar from '@/components/DMSidebar'
import { isMe } from '@/lib/routes'

const ServerLayout = async ({ children, params }: LayoutProps<'/channels/[serverId]'>) => {
  const { serverId } = await params
  return (
    <>
      {isMe(serverId) ? <DMSidebar /> : <ChannelSidebar serverId={serverId} />}
      <main className="content">{children}</main>
    </>
  )
}

export default ServerLayout
