import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SEED_UNREAD } from '../constants/seed'

export interface ReadState {
  /** Channels never opened count as read up to this point */
  baseline: number
  lastReadAt: Record<string, number>
}

const readStateSlice = createSlice({
  name: 'readState',
  initialState: (): ReadState => {
    const now = Date.now()
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000
    return {
      baseline: now,
      lastReadAt: Object.fromEntries(SEED_UNREAD.map(id => [id, twoDaysAgo])),
    }
  },
  reducers: {
    markRead: {
      reducer(state, action: PayloadAction<{ channelId: string; at: number }>) {
        state.lastReadAt[action.payload.channelId] = action.payload.at
      },
      prepare(channelId: string) {
        return { payload: { channelId, at: Date.now() } }
      },
    },
    markUnread(state, action: PayloadAction<{ channelId: string; before: number }>) {
      state.lastReadAt[action.payload.channelId] = action.payload.before - 1
    },
  },
})

export const { markRead, markUnread } = readStateSlice.actions
export const readStateReducer = readStateSlice.reducer
