import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SEED_DMS } from '../constants/seed'
import type { DMChannel } from '../models'

const dmsSlice = createSlice({
  name: 'dms',
  initialState: (): DMChannel[] => SEED_DMS,
  reducers: {
    openDM(state, action: PayloadAction<string>) {
      const recipientId = action.payload
      const existing = state.find(d => d.recipientId === recipientId)
      const dm = existing ?? { id: `dm-${recipientId.replace(/^u-/, '')}`, recipientId }
      return [dm, ...state.filter(d => d.recipientId !== recipientId)]
    },
    closeDM(state, action: PayloadAction<string>) {
      return state.filter(d => d.id !== action.payload)
    },
  },
})

export const dmIdFor = (recipientId: string) => `dm-${recipientId.replace(/^u-/, '')}`

export const { openDM, closeDM } = dmsSlice.actions
export const dmsReducer = dmsSlice.reducer
