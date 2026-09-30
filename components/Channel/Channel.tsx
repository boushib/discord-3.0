'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useFileUploads, useSelector } from '../../hooks'
import { markRead, rememberChannel, setSearch } from '../../store'
import { findChannel, selectMessages } from '../../store/selectors'
import Members from '../Members'
import MessageBox from '../MessageBox'
import MessageList from './MessageList'
import ChannelHeader from './ChannelHeader'
import { DMCall, VoiceChannelView } from '../Voice'
import ThreadPanel from './ThreadPanel'
import styles from './Channel.module.sass'

const Channel = ({ channelId }: { channelId: string }) => {
  const dispatch = useAppDispatch()
  const context = useSelector(s => findChannel(s, channelId))
  const messageCount = useSelector(s => selectMessages(s, channelId).length)
  const memberListOpen = useSelector(s => s.prefs.memberListOpen)
  // Only show the open thread if it belongs to this channel
  const openThreadId = useSelector(s => {
    const id = s.ui.openThreadId
    return id && s.threads[id]?.parentChannelId === channelId ? id : null
  })
  const serverId = context?.kind === 'server' ? context.server.id : undefined
  const upload = useFileUploads(channelId)
  const [dragging, setDragging] = useState(false)

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

  if (context.kind === 'server' && context.channel.type === 'voice') {
    return <VoiceChannelView server={context.server} channel={context.channel} />
  }

  return (
    <>
      <div
        className={styles.channel}
        onDragOver={e => {
          if (!e.dataTransfer.types.includes('Files')) return
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
        }}
        onDrop={e => {
          if (!e.dataTransfer.files.length) return
          e.preventDefault()
          setDragging(false)
          upload(e.dataTransfer.files)
        }}
      >
        {dragging && (
          <div className={styles.dropOverlay}>
            <div className={styles.dropCard}>
              <div className={styles.dropTitle}>
                Upload to {context.kind === 'server' ? `#${context.channel.name}` : context.recipient.displayName}
              </div>
              <p>You can add comments before sending.</p>
            </div>
          </div>
        )}
        <ChannelHeader channelId={channelId} context={context} />
        {context.kind === 'dm' && <DMCall dmId={context.dmId} recipient={context.recipient} />}
        <MessageList key={`list-${channelId}`} channelId={channelId} context={context} />
        <MessageBox key={`box-${channelId}`} channelId={channelId} context={context} />
      </div>
      {openThreadId ? (
        <ThreadPanel threadId={openThreadId} />
      ) : (
        context.kind === 'server' && memberListOpen && <Members server={context.server} />
      )}
    </>
  )
}

export default Channel
