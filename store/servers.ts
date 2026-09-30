import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import { SEED_SERVERS } from '../constants/seed'
import type { Channel, ChannelType, Role, Server } from '../models'

export interface ServersState {
  byId: Record<string, Server>
  order: string[]
}

export const createServersState = (): ServersState => ({
  byId: Object.fromEntries(SEED_SERVERS.map(s => [s.id, s])),
  order: SEED_SERVERS.map(s => s.id),
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
    kickMember(state, action: PayloadAction<{ serverId: string; userId: string }>) {
      const server = state.byId[action.payload.serverId]
      if (!server) return
      server.members = server.members.filter(m => m.userId !== action.payload.userId)
      for (const key of Object.keys(server.voiceStates)) {
        server.voiceStates[key] = server.voiceStates[key].filter(id => id !== action.payload.userId)
      }
    },
    leaveServer(state, action: PayloadAction<string>) {
      delete state.byId[action.payload]
      state.order = state.order.filter(id => id !== action.payload)
    },
    moveServer(state, action: PayloadAction<{ from: number; to: number }>) {
      const [moved] = state.order.splice(action.payload.from, 1)
      state.order.splice(action.payload.to, 0, moved)
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
  leaveServer,
  moveServer,
  createChannel,
  updateChannel,
  deleteChannel,
  joinVoice,
  leaveVoice,
} = serversSlice.actions
export const serversReducer = serversSlice.reducer
