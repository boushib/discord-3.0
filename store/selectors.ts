import { createSelector } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import type { Message, Server, User } from '../models'
import type { RootState } from '.'

const EMPTY: Message[] = []

export const selectCurrentUser = (s: RootState) => s.users.byId[CURRENT_USER_ID]

export const selectMessages = (s: RootState, channelId: string) =>
  s.messages[channelId] ?? EMPTY

export type ChannelContext =
  | { kind: 'server'; server: Server; channel: Server['channels'][number] }
  | { kind: 'dm'; dmId: string; recipient: User }

export const findChannel = createSelector(
  [
    (s: RootState) => s.dms,
    (s: RootState) => s.servers,
    (s: RootState) => s.users.byId,
    (_: RootState, channelId: string) => channelId,
  ],
  (dms, servers, users, channelId): ChannelContext | null => {
    const dm = dms.find(d => d.id === channelId)
    if (dm) {
      const recipient = users[dm.recipientId]
      return recipient ? { kind: 'dm', dmId: dm.id, recipient } : null
    }
    for (const serverId of servers.order) {
      const server = servers.byId[serverId]
      const channel = server.channels.find(c => c.id === channelId)
      if (channel) return { kind: 'server', server, channel }
    }
    return null
  }
)

const lastReadAt = (s: RootState, channelId: string) =>
  s.readState.lastReadAt[channelId] ?? s.readState.baseline

const unreadMessages = (s: RootState, channelId: string) => {
  const since = lastReadAt(s, channelId)
  const messages = s.messages[channelId] ?? EMPTY
  const result: Message[] = []
  for (let i = messages.length - 1; i >= 0 && messages[i].createdAt > since; i--) {
    if (messages[i].authorId !== CURRENT_USER_ID) result.push(messages[i])
  }
  return result
}

export const isMention = (s: RootState, message: Message) => {
  const me = s.users.byId[CURRENT_USER_ID]
  const content = message.content.toLowerCase()
  return (
    content.includes(`@${me.username.toLowerCase()}`) ||
    content.includes('@everyone') ||
    (message.replyToId !== undefined &&
      (s.messages[message.channelId] ?? EMPTY).some(
        m => m.id === message.replyToId && m.authorId === CURRENT_USER_ID
      ))
  )
}

export const selectIsUnread = (s: RootState, channelId: string) =>
  unreadMessages(s, channelId).length > 0

export const selectMentionCount = (s: RootState, channelId: string) => {
  // Every unread DM message counts as a mention, like on Discord
  if (s.dms.some(d => d.id === channelId)) return unreadMessages(s, channelId).length
  return unreadMessages(s, channelId).filter(m => isMention(s, m)).length
}

export const selectServerUnread = (s: RootState, serverId: string) => {
  const server = s.servers.byId[serverId]
  let unread = false
  let mentions = 0
  for (const channel of server?.channels ?? []) {
    if (channel.type === 'voice') continue
    if (selectIsUnread(s, channel.id)) unread = true
    mentions += selectMentionCount(s, channel.id)
  }
  return { unread, mentions }
}

export const firstTextChannel = (server: Server) =>
  server.channels.find(c => c.type !== 'voice')

export const memberOf = (server: Server | undefined, userId: string) =>
  server?.members.find(m => m.userId === userId)

export const displayNameIn = (server: Server | undefined, user: User) =>
  memberOf(server, user.id)?.nickname ?? user.displayName

/** Color of the member's highest colored role (roles are ordered by rank) */
export const roleColorIn = (server: Server | undefined, userId: string) => {
  const member = memberOf(server, userId)
  if (!server || !member) return undefined
  return server.roles.find(r => r.color && member.roleIds.includes(r.id))?.color
}
