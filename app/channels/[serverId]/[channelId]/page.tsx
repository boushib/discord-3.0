import Channel from '@/components/Channel'

const ChannelPage = async ({ params }: PageProps<'/channels/[serverId]/[channelId]'>) => {
  const { channelId } = await params
  return <Channel channelId={channelId} />
}

export default ChannelPage
