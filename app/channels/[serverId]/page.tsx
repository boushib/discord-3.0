import FriendsPage from '@/components/Friends'
import ServerRedirect from '@/components/ServerRedirect'
import { isMe } from '@/lib/routes'

const ServerPage = async ({ params }: PageProps<'/channels/[serverId]'>) => {
  const { serverId } = await params
  return isMe(serverId) ? <FriendsPage /> : <ServerRedirect serverId={serverId} />
}

export default ServerPage
