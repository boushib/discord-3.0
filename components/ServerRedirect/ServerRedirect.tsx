'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from '../../hooks'
import { channelHref } from '../../lib/routes'
import { firstTextChannel } from '../../store/selectors'

/** /channels/[serverId] → last visited (or first) text channel of that server */
const ServerRedirect = ({ serverId }: { serverId: string }) => {
  const router = useRouter()
  const server = useSelector(s => s.servers.byId[serverId])
  const lastChannelId = useSelector(s => s.prefs.lastChannelByServer[serverId])

  useEffect(() => {
    if (!server) {
      router.replace('/channels/@me')
      return
    }
    const target =
      server.channels.find(c => c.id === lastChannelId && c.type !== 'voice') ??
      firstTextChannel(server)
    if (target) router.replace(channelHref(serverId, target.id))
  }, [router, server, serverId, lastChannelId])

  return null
}

export default ServerRedirect
