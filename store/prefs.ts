import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PrefsState {
  collapsedCategories: string[]
  lastChannelByServer: Record<string, string>
  memberListOpen: boolean
  compactMode: boolean
  muted: boolean
  deafened: boolean
}

const initialState: PrefsState = {
  collapsedCategories: [],
  lastChannelByServer: {},
  memberListOpen: true,
  compactMode: false,
  muted: false,
  deafened: false,
}

const prefsSlice = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<string>) {
      const id = action.payload
      state.collapsedCategories = state.collapsedCategories.includes(id)
        ? state.collapsedCategories.filter(c => c !== id)
        : [...state.collapsedCategories, id]
    },
    rememberChannel(state, action: PayloadAction<{ serverId: string; channelId: string }>) {
      state.lastChannelByServer[action.payload.serverId] = action.payload.channelId
    },
    toggleMemberList(state) {
      state.memberListOpen = !state.memberListOpen
    },
    setCompactMode(state, action: PayloadAction<boolean>) {
      state.compactMode = action.payload
    },
    toggleMute(state) {
      state.muted = !state.muted
      if (!state.muted) state.deafened = false
    },
    toggleDeafen(state) {
      state.deafened = !state.deafened
      state.muted = state.deafened
    },
  },
})

export const {
  toggleCategory,
  rememberChannel,
  toggleMemberList,
  setCompactMode,
  toggleMute,
  toggleDeafen,
} = prefsSlice.actions
export const prefsReducer = prefsSlice.reducer
