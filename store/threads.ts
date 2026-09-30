import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { SEED_THREADS } from '../constants/seed'
import type { Thread } from '../models'

export type ThreadsState = Record<string, Thread>

const threadsSlice = createSlice({
  name: 'threads',
  initialState: (): ThreadsState => Object.fromEntries(SEED_THREADS(Date.now()).map(t => [t.id, t])),
  reducers: {
    createThread: {
      reducer(state, action: PayloadAction<Thread>) {
        state[action.payload.id] = action.payload
      },
      prepare(input: Omit<Thread, 'id' | 'createdAt'>) {
        return { payload: { ...input, id: `t-${nanoid(8)}`, createdAt: Date.now() } }
      },
    },
    renameThread(state, action: PayloadAction<{ threadId: string; name: string }>) {
      const thread = state[action.payload.threadId]
      if (thread) thread.name = action.payload.name
    },
    deleteThread(state, action: PayloadAction<string>) {
      delete state[action.payload]
    },
  },
})

export const { createThread, renameThread, deleteThread } = threadsSlice.actions
export const threadsReducer = threadsSlice.reducer
