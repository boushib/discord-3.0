import Channel from '@/components/Channel'
import { NitroPage, ShopPage } from '@/components/Store'
import { isMe } from '@/lib/routes'

const ChannelPage = async ({ params }: PageProps<'/channels/[serverId]/[channelId]'>) => {
  const { serverId, channelId } = await params
  if (isMe(serverId) && channelId === 'nitro') return <NitroPage />
  if (isMe(serverId) && channelId === 'shop') return <ShopPage />
  return <Channel channelId={channelId} />
}

export default ChannelPage
