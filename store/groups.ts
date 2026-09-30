import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import type { GroupDM } from '../models'

const groupsSlice = createSlice({
  name: 'groups',
  initialState: (): GroupDM[] => [],
  reducers: {
    createGroup: {
      reducer(state, action: PayloadAction<GroupDM>) {
        state.unshift(action.payload)
      },
      prepare(memberIds: string[]) {
        return {
          payload: { id: `g-${nanoid(8)}`, memberIds, ownerId: CURRENT_USER_ID, createdAt: Date.now() },
        }
      },
    },
    renameGroup(state, action: PayloadAction<{ groupId: string; name: string }>) {
      const group = state.find(g => g.id === action.payload.groupId)
      if (group) group.name = action.payload.name.trim() || undefined
    },
    leaveGroup(state, action: PayloadAction<string>) {
      return state.filter(g => g.id !== action.payload)
    },
  },
})

export const groupName = (group: GroupDM, names: (id: string) => string) =>
  group.name ?? group.memberIds.map(names).join(', ')

export const { createGroup, renameGroup, leaveGroup } = groupsSlice.actions
export const groupsReducer = groupsSlice.reducer
