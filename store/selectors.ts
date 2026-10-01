import { createSelector } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import type { CustomEmoji, CustomSticker, GroupDM, Message, Server, Thread, User } from '../models'
import { groupName } from './groups'
import type { RootState } from '.'

const EMPTY: Message[] = []

export const selectCurrentUser = (s: RootState) => s.users.byId[CURRENT_USER_ID]

export const selectMessages = (s: RootState, channelId: string) =>
  s.messages[channelId] ?? EMPTY

export type ChannelContext =
  | { kind: 'server'; server: Server; channel: Server['channels'][number]; thread?: Thread }
  | { kind: 'dm'; dmId: string; recipient: User }
  | { kind: 'group'; groupId: string; group: GroupDM; members: User[]; name: string }

export const findChannel = createSelector(
  [
    (s: RootState) => s.dms,
    (s: RootState) => s.servers,
    (s: RootState) => s.users.byId,
    (s: RootState) => s.threads,
    (s: RootState) => s.groups,
    (_: RootState, channelId: string) => channelId,
  ],
  (dms, servers, users, threads, groups, channelId): ChannelContext | null => {
    const group = groups.find(g => g.id === channelId)
    if (group) {
      const members = group.memberIds.map(id => users[id]).filter(Boolean)
      return { kind: 'group', groupId: group.id, group, members, name: groupName(group, id => users[id]?.displayName ?? 'Unknown') }
    }
    const thread = threads[channelId]
    if (thread) {
      const server = servers.byId[thread.serverId]
      const parent = server?.channels.find(c => c.id === thread.parentChannelId)
      if (!server || !parent) return null
      // A thread behaves like a text channel that lives inside its parent's server
      return {
        kind: 'server',
        server,
        channel: { id: thread.id, name: thread.name, type: 'text', categoryId: parent.categoryId },
        thread,
      }
    }
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

const mentionsMe = (me: User, messages: RootState['messages'], message: Message) => {
  const content = message.content.toLowerCase()
  return (
    content.includes(`@${me.username.toLowerCase()}`) ||
    content.includes('@everyone') ||
    (message.replyToId !== undefined &&
      (messages[message.channelId] ?? EMPTY).some(
        m => m.id === message.replyToId && m.authorId === CURRENT_USER_ID
      ))
  )
}

export const isMention = (s: RootState, message: Message) =>
  mentionsMe(s.users.byId[CURRENT_USER_ID], s.messages, message)

export const selectIsMuted = (s: RootState, channelId: string) => s.prefs.mutedChannels.includes(channelId)

const levelOf = (s: RootState, channelId: string) => s.prefs.notifications[channelId] ?? 'all'

/** Unread dot: hidden for muted channels and ones set to mentions/nothing */
export const selectIsUnread = (s: RootState, channelId: string) =>
  !selectIsMuted(s, channelId) && levelOf(s, channelId) === 'all' && unreadMessages(s, channelId).length > 0

export const selectMentionCount = (s: RootState, channelId: string) => {
  if (levelOf(s, channelId) === 'none') return 0
  // Every unread DM or group DM message counts as a mention, like on Discord
  if (s.dms.some(d => d.id === channelId) || s.groups.some(g => g.id === channelId)) {
    return unreadMessages(s, channelId).length
  }
  return unreadMessages(s, channelId).filter(m => isMention(s, m)).length
}

/** Unread mentions of the current user across every channel, newest first */
export const selectRecentMentions = createSelector(
  [(s: RootState) => s.messages, (s: RootState) => s.users.byId[CURRENT_USER_ID]],
  (messages, me) => {
    const result: Message[] = []
    for (const list of Object.values(messages)) {
      for (const m of list) if (m.authorId !== CURRENT_USER_ID && mentionsMe(me, messages, m)) result.push(m)
    }
    return result.sort((a, b) => b.createdAt - a.createdAt).slice(0, 30)
  }
)

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

/** Threads started in a channel, newest first */
export const selectChannelThreads = createSelector(
  [(s: RootState) => s.threads, (_: RootState, channelId: string) => channelId],
  (threads, channelId) =>
    Object.values(threads)
      .filter(t => t.parentChannelId === channelId)
      .sort((a, b) => b.createdAt - a.createdAt)
)

/** Everyone in a conversation except the current user */
export const otherParticipants = (context: ChannelContext, users: Record<string, User>): User[] => {
  if (context.kind === 'dm') return [context.recipient]
  if (context.kind === 'group') return context.members
  return context.server.members.map(m => users[m.userId]).filter(u => u && u.id !== CURRENT_USER_ID)
}

/** "@Sarah", "Kai, Omar" or "#general · Valorant" */
export const contextLabel = (context: ChannelContext) =>
  context.kind === 'dm'
    ? `@${context.recipient.displayName}`
    : context.kind === 'group'
      ? context.name
      : `#${context.channel.name} · ${context.server.name}`

/** Every custom emoji across your servers, keyed by id (for rendering <:name:id>) */
export const selectCustomEmojiById = createSelector([(s: RootState) => s.servers.byId], byId => {
  const map: Record<string, CustomEmoji> = {}
  for (const server of Object.values(byId)) for (const e of server.emojis ?? []) map[e.id] = e
  return map
})

/** Custom emoji/stickers grouped by server, current server first */
export const selectCustomExpressions = createSelector(
  [(s: RootState) => s.servers, (_: RootState, currentServerId?: string) => currentServerId],
  (servers, currentServerId) => {
    const ids = currentServerId
      ? [currentServerId, ...servers.order.filter(id => id !== currentServerId)]
      : servers.order
    return ids
      .map(id => servers.byId[id])
      .filter((server): server is Server => !!server && !!(server.emojis?.length || server.stickers?.length))
      .map(server => ({
        serverId: server.id,
        serverName: server.name,
        emojis: server.emojis ?? ([] as CustomEmoji[]),
        stickers: server.stickers ?? ([] as CustomSticker[]),
      }))
  }
)
