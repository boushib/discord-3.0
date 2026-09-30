import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import { SEED_SERVERS } from '../constants/seed'
import type { Channel, ChannelType, Server } from '../models'

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
  leaveServer,
  moveServer,
  createChannel,
  updateChannel,
  deleteChannel,
  joinVoice,
  leaveVoice,
} = serversSlice.actions
export const serversReducer = serversSlice.reducer
