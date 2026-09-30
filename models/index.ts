export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline'

export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  /** Index into AVATAR_COLORS, used for the default Discord avatar */
  avatarColor: number
  bannerColor?: string
  status: PresenceStatus
  customStatus?: string
  bio?: string
  bot?: boolean
  createdAt: number
  premium?: boolean
  /** Avatar decoration id from the shop */
  decoration?: string
  ownedDecorations?: string[]
  email?: string
  phone?: string
}

export interface Role {
  id: string
  name: string
  color?: string
  /** Hoisted roles get their own section in the member list */
  hoist: boolean
}

export interface Member {
  userId: string
  roleIds: string[]
  nickname?: string
  joinedAt: number
}

export type ChannelType = 'text' | 'voice' | 'announcement'

export interface Channel {
  id: string
  name: string
  type: ChannelType
  categoryId: string | null
  topic?: string
}

export interface Category {
  id: string
  name: string
}

export interface Server {
  id: string
  name: string
  icon?: string
  bannerColor?: string
  verified?: boolean
  ownerId: string
  categories: Category[]
  channels: Channel[]
  roles: Role[]
  members: Member[]
  /** User ids connected to each voice channel */
  voiceStates: Record<string, string[]>
}

export interface DMChannel {
  id: string
  recipientId: string
}

export interface Reaction {
  emoji: string
  userIds: string[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  /** data: URL (persisted) or blob: URL (this session only) */
  url: string
  width?: number
  height?: number
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  content: string
  createdAt: number
  editedAt?: number
  replyToId?: string
  reactions: Reaction[]
  pinned?: boolean
  attachments?: Attachment[]
  /** Set on the message a thread was started from */
  threadId?: string
  sticker?: { id: string; name: string; emoji: string }
  gift?: { plan: 'Nitro' | 'Nitro Basic'; months: number; claimedBy?: string }
  poll?: Poll
}

export type RelationshipType = 'friend' | 'incoming' | 'outgoing' | 'blocked'

export interface Relationship {
  userId: string
  type: RelationshipType
}

export interface Thread {
  id: string
  name: string
  serverId: string
  parentChannelId: string
  parentMessageId: string
  ownerId: string
  createdAt: number
}

export interface Poll {
  question: string
  options: { id: string; text: string; emoji?: string; voterIds: string[] }[]
  multiple: boolean
  endsAt: number
}
