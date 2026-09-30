import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import { SEED_RELATIONSHIPS, SEED_USERS } from '../constants/seed'
import type { PresenceStatus, Relationship, User } from '../models'

export interface UsersState {
  byId: Record<string, User>
  relationships: Relationship[]
}

const usersSlice = createSlice({
  name: 'users',
  initialState: (): UsersState => ({
    byId: Object.fromEntries(SEED_USERS.map(u => [u.id, u])),
    relationships: SEED_RELATIONSHIPS,
  }),
  reducers: {
    setStatus(state, action: PayloadAction<PresenceStatus>) {
      state.byId[CURRENT_USER_ID].status = action.payload
    },
    updateProfile(state, action: PayloadAction<Partial<Omit<User, 'id'>>>) {
      Object.assign(state.byId[CURRENT_USER_ID], action.payload)
    },
    sendFriendRequest(state, action: PayloadAction<string>) {
      const username = action.payload.trim().toLowerCase()
      const user = Object.values(state.byId).find(u => u.username.toLowerCase() === username)
      if (!user || user.id === CURRENT_USER_ID) return
      const existing = state.relationships.find(r => r.userId === user.id)
      if (existing?.type === 'incoming') existing.type = 'friend'
      else if (!existing) state.relationships.push({ userId: user.id, type: 'outgoing' })
    },
    acceptFriend(state, action: PayloadAction<string>) {
      const rel = state.relationships.find(r => r.userId === action.payload)
      if (rel) rel.type = 'friend'
    },
    removeRelationship(state, action: PayloadAction<string>) {
      state.relationships = state.relationships.filter(r => r.userId !== action.payload)
    },
    blockUser(state, action: PayloadAction<string>) {
      state.relationships = state.relationships.filter(r => r.userId !== action.payload)
      state.relationships.push({ userId: action.payload, type: 'blocked' })
    },
  },
})

export const {
  setStatus,
  updateProfile,
  sendFriendRequest,
  acceptFriend,
  removeRelationship,
  blockUser,
} = usersSlice.actions
export const usersReducer = usersSlice.reducer
