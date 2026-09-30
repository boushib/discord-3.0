'use client'

import { useEffect } from 'react'
import { useAppDispatch, useSelector } from '../../hooks'
import { markRead, rememberChannel, setSearch } from '../../store'
import { findChannel, selectMessages } from '../../store/selectors'
import Members from '../Members'
import MessageBox from '../MessageBox'
import MessageList from './MessageList'
import ChannelHeader from './ChannelHeader'
import styles from './Channel.module.sass'

const Channel = ({ channelId }: { channelId: string }) => {
  const dispatch = useAppDispatch()
  const context = useSelector(s => findChannel(s, channelId))
  const messageCount = useSelector(s => selectMessages(s, channelId).length)
  const memberListOpen = useSelector(s => s.prefs.memberListOpen)
  const serverId = context?.kind === 'server' ? context.server.id : undefined

  useEffect(() => {
    dispatch(markRead(channelId))
  }, [dispatch, channelId, messageCount])

  useEffect(() => {
    dispatch(setSearch(''))
  }, [dispatch, channelId])

  useEffect(() => {
    if (serverId) dispatch(rememberChannel({ serverId, channelId }))
  }, [dispatch, serverId, channelId])

  if (!context) return <div className={styles.empty}>This channel doesn’t exist.</div>

  return (
    <>
      <div className={styles.channel}>
        <ChannelHeader channelId={channelId} context={context} />
        <MessageList key={`list-${channelId}`} channelId={channelId} context={context} />
        <MessageBox key={`box-${channelId}`} channelId={channelId} context={context} />
      </div>
      {context.kind === 'server' && memberListOpen && <Members server={context.server} />}
    </>
  )
}

export default Channel
