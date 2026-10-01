import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import { SEED_SERVERS } from '../constants/seed'
import type { Channel, ChannelType, CustomEmoji, CustomSticker, Role, Server, ServerFolder } from '../models'

export interface ServersState {
  byId: Record<string, Server>
  order: string[]
  folders: Record<string, ServerFolder>
}

const folderOf = (state: ServersState, serverId: string) =>
  Object.values(state.folders).find(f => f.serverIds.includes(serverId))

/** Remove a server from its folder, dissolving folders left with one server */
const detach = (state: ServersState, serverId: string) => {
  const folder = folderOf(state, serverId)
  if (!folder) return
  folder.serverIds = folder.serverIds.filter(id => id !== serverId)
  if (folder.serverIds.length < 2) delete state.folders[folder.id]
}

export const createServersState = (): ServersState => ({
  byId: Object.fromEntries(SEED_SERVERS.map(s => [s.id, s])),
  order: SEED_SERVERS.map(s => s.id),
  folders: {},
})

const serversSlice = createSlice({
  name: 'servers',
  initialState: createServersState,
  reducers: {
    createServer: {
      reducer(state, action: PayloadAction<Server>) {
        state.byId[action.payload.id] = action.payload
        state.order.push(action.payload.id)
      },
      prepare({ name, icon }: { name: string; icon?: string }) {
        const id = `s-${nanoid(8)}`
        const textCat = `cat-${nanoid(6)}`
        const voiceCat = `cat-${nanoid(6)}`
        const server: Server = {
          id,
          name,
          icon,
          ownerId: CURRENT_USER_ID,
          categories: [
            { id: textCat, name: 'Text Channels' },
            { id: voiceCat, name: 'Voice Channels' },
          ],
          channels: [
            { id: `c-${nanoid(8)}`, name: 'general', type: 'text', categoryId: textCat },
            { id: `c-${nanoid(8)}`, name: 'General', type: 'voice', categoryId: voiceCat },
          ],
          roles: [],
          members: [{ userId: CURRENT_USER_ID, roleIds: [], joinedAt: Date.now() }],
          voiceStates: {},
        }
        return { payload: server }
      },
    },
    joinServer(state, action: PayloadAction<Server>) {
      const server = action.payload
      if (state.byId[server.id]) return
      state.byId[server.id] = {
        ...server,
        members: [...server.members, { userId: CURRENT_USER_ID, roleIds: [], joinedAt: Date.now() }],
      }
      state.order.push(server.id)
    },
    updateServer(
      state,
      action: PayloadAction<{ serverId: string; changes: Partial<Pick<Server, 'name' | 'icon' | 'bannerColor'>> }>
    ) {
      const server = state.byId[action.payload.serverId]
      if (server) Object.assign(server, action.payload.changes)
    },
    createRole: {
      reducer(state, action: PayloadAction<{ serverId: string; role: Role }>) {
        state.byId[action.payload.serverId]?.roles.push(action.payload.role)
      },
      prepare(serverId: string) {
        return { payload: { serverId, role: { id: `r-${nanoid(8)}`, name: 'new role', color: '#99aab5', hoist: false } } }
      },
    },
    updateRole(state, action: PayloadAction<{ serverId: string; roleId: string; changes: Partial<Omit<Role, 'id'>> }>) {
      const role = state.byId[action.payload.serverId]?.roles.find(r => r.id === action.payload.roleId)
      if (role) Object.assign(role, action.payload.changes)
    },
    moveRole(state, action: PayloadAction<{ serverId: string; roleId: string; direction: -1 | 1 }>) {
      const roles = state.byId[action.payload.serverId]?.roles
      if (!roles) return
      const i = roles.findIndex(r => r.id === action.payload.roleId)
      const j = i + action.payload.direction
      if (i < 0 || j < 0 || j >= roles.length) return
      ;[roles[i], roles[j]] = [roles[j], roles[i]]
    },
    deleteRole(state, action: PayloadAction<{ serverId: string; roleId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (!server) return
      server.roles = server.roles.filter(r => r.id !== action.payload.roleId)
      for (const m of server.members) m.roleIds = m.roleIds.filter(id => id !== action.payload.roleId)
    },
    toggleMemberRole(state, action: PayloadAction<{ serverId: string; userId: string; roleId: string }>) {
      const member = state.byId[action.payload.serverId]?.members.find(m => m.userId === action.payload.userId)
      if (!member) return
      member.roleIds = member.roleIds.includes(action.payload.roleId)
        ? member.roleIds.filter(id => id !== action.payload.roleId)
        : [...member.roleIds, action.payload.roleId]
    },
    addEmoji: {
      reducer(state, action: PayloadAction<{ serverId: string; emoji: CustomEmoji }>) {
        const server = state.byId[action.payload.serverId]
        if (server) (server.emojis ??= []).push(action.payload.emoji)
      },
      prepare(input: { serverId: string; name: string; url: string }) {
        return { payload: { serverId: input.serverId, emoji: { id: `e-${nanoid(8)}`, name: input.name, url: input.url } } }
      },
    },
    renameEmoji(state, action: PayloadAction<{ serverId: string; emojiId: string; name: string }>) {
      const emoji = state.byId[action.payload.serverId]?.emojis?.find(e => e.id === action.payload.emojiId)
      if (emoji) emoji.name = action.payload.name
    },
    removeEmoji(state, action: PayloadAction<{ serverId: string; emojiId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (server?.emojis) server.emojis = server.emojis.filter(e => e.id !== action.payload.emojiId)
    },
    addSticker: {
      reducer(state, action: PayloadAction<{ serverId: string; sticker: CustomSticker }>) {
        const server = state.byId[action.payload.serverId]
        if (server) (server.stickers ??= []).push(action.payload.sticker)
      },
      prepare(input: { serverId: string; name: string; url: string }) {
        return { payload: { serverId: input.serverId, sticker: { id: `st-${nanoid(8)}`, name: input.name, url: input.url } } }
      },
    },
    renameSticker(state, action: PayloadAction<{ serverId: string; stickerId: string; name: string }>) {
      const sticker = state.byId[action.payload.serverId]?.stickers?.find(s => s.id === action.payload.stickerId)
      if (sticker) sticker.name = action.payload.name
    },
    removeSticker(state, action: PayloadAction<{ serverId: string; stickerId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (server?.stickers) server.stickers = server.stickers.filter(s => s.id !== action.payload.stickerId)
    },
    kickMember(state, action: PayloadAction<{ serverId: string; userId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (!server) return
      server.members = server.members.filter(m => m.userId !== action.payload.userId)
      for (const key of Object.keys(server.voiceStates)) {
        server.voiceStates[key] = server.voiceStates[key].filter(id => id !== action.payload.userId)
      }
    },
    leaveServer(state, action: PayloadAction<string>) {
      detach(state, action.payload)
      delete state.byId[action.payload]
      state.order = state.order.filter(id => id !== action.payload)
    },
    moveServer(state, action: PayloadAction<{ from: number; to: number }>) {
      const [moved] = state.order.splice(action.payload.from, 1)
      state.order.splice(action.payload.to, 0, moved)
      // Landing outside your folder takes you out of it
      const folder = folderOf(state, moved)
      if (folder) {
        const neighbours = [state.order[action.payload.to - 1], state.order[action.payload.to + 1]]
        if (!neighbours.some(id => folder.serverIds.includes(id))) detach(state, moved)
      }
    },
    /** Drop one server onto another: join its folder, or start a new one */
    combineServers: {
      reducer(state, action: PayloadAction<{ serverId: string; targetId: string; folderId: string }>) {
        const { serverId, targetId, folderId } = action.payload
        if (serverId === targetId) return
        detach(state, serverId)
        const folder = folderOf(state, targetId)
        if (folder) folder.serverIds.push(serverId)
        else {
          state.folders[folderId] = {
            id: folderId,
            color: '#5865f2',
            serverIds: [targetId, serverId],
            expanded: false,
          }
        }
        // Keep folder members next to each other in the order
        const members = (folder ?? state.folders[folderId]).serverIds
        const rest = state.order.filter(id => !members.includes(id))
        const at = state.order.filter(id => !members.includes(id) || id === members[0]).indexOf(members[0])
        rest.splice(at, 0, ...members)
        state.order = rest
      },
      prepare(input: { serverId: string; targetId: string }) {
        return { payload: { ...input, folderId: `f-${nanoid(6)}` } }
      },
    },
    toggleFolder(state, action: PayloadAction<string>) {
      const folder = state.folders[action.payload]
      if (folder) folder.expanded = !folder.expanded
    },
    updateFolder(state, action: PayloadAction<{ folderId: string; changes: Partial<Pick<ServerFolder, 'name' | 'color'>> }>) {
      const folder = state.folders[action.payload.folderId]
      if (folder) Object.assign(folder, action.payload.changes)
    },
    removeFolder(state, action: PayloadAction<string>) {
      delete state.folders[action.payload]
    },
    createChannel: {
      reducer(state, action: PayloadAction<{ serverId: string; channel: Channel }>) {
        state.byId[action.payload.serverId]?.channels.push(action.payload.channel)
      },
      prepare(input: {
        serverId: string
        name: string
        type: ChannelType
        categoryId: string | null
      }) {
        const name =
          input.type === 'voice'
            ? input.name.trim()
            : input.name.trim().toLowerCase().replace(/\s+/g, '-')
        return {
          payload: {
            serverId: input.serverId,
            channel: { id: `c-${nanoid(8)}`, name, type: input.type, categoryId: input.categoryId },
          },
        }
      },
    },
    updateChannel(
      state,
      action: PayloadAction<{ serverId: string; channelId: string; changes: Partial<Channel> }>
    ) {
      const channel = state.byId[action.payload.serverId]?.channels.find(
        c => c.id === action.payload.channelId
      )
      if (channel) Object.assign(channel, action.payload.changes)
    },
    deleteChannel(state, action: PayloadAction<{ serverId: string; channelId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (server) server.channels = server.channels.filter(c => c.id !== action.payload.channelId)
    },
    joinVoice(state, action: PayloadAction<{ serverId: string; channelId: string; userId: string }>) {
      const { serverId, channelId, userId } = action.payload
      for (const server of Object.values(state.byId)) {
        for (const key of Object.keys(server.voiceStates)) {
          server.voiceStates[key] = server.voiceStates[key].filter(id => id !== userId)
        }
      }
      const server = state.byId[serverId]
      if (server) (server.voiceStates[channelId] ??= []).push(userId)
    },
    leaveVoice(state, action: PayloadAction<string>) {
      for (const server of Object.values(state.byId)) {
        for (const key of Object.keys(server.voiceStates)) {
          server.voiceStates[key] = server.voiceStates[key].filter(id => id !== action.payload)
        }
      }
    },
  },
})

export const {
  createServer,
  joinServer,
  updateServer,
  createRole,
  updateRole,
  moveRole,
  deleteRole,
  toggleMemberRole,
  kickMember,
  addEmoji,
  renameEmoji,
  removeEmoji,
  addSticker,
  renameSticker,
  removeSticker,
  leaveServer,
  moveServer,
  combineServers,
  toggleFolder,
  updateFolder,
  removeFolder,
  createChannel,
  updateChannel,
  deleteChannel,
  joinVoice,
  leaveVoice,
} = serversSlice.actions
export const serversReducer = serversSlice.reducer
