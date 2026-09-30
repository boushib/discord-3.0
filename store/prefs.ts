import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationLevel = 'all' | 'mentions' | 'none'

export interface PrefsState {
  /** Version of the demo data this state was created from */
  seedVersion: number
  /** Per-channel overrides; channels default to 'all' */
  notifications: Record<string, NotificationLevel>
  mutedChannels: string[]
  collapsedCategories: string[]
  lastChannelByServer: Record<string, string>
  memberListOpen: boolean
  compactMode: boolean
  notificationSounds: boolean
  desktopNotifications: boolean
  theme: 'dark' | 'light'
  muted: boolean
  deafened: boolean
}

export const SEED_VERSION = 10

export const initialPrefs: PrefsState = {
  seedVersion: SEED_VERSION,
  notifications: {},
  mutedChannels: [],
  collapsedCategories: [],
  lastChannelByServer: {},
  memberListOpen: true,
  compactMode: false,
  notificationSounds: true,
  desktopNotifications: false,
  theme: 'dark',
  muted: false,
  deafened: false,
}

const prefsSlice = createSlice({
  name: 'prefs',
  initialState: initialPrefs,
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
    setNotificationLevel(state, action: PayloadAction<{ channelId: string; level: NotificationLevel }>) {
      if (action.payload.level === 'all') delete state.notifications[action.payload.channelId]
      else state.notifications[action.payload.channelId] = action.payload.level
    },
    toggleChannelMute(state, action: PayloadAction<string>) {
      const id = action.payload
      state.mutedChannels = state.mutedChannels.includes(id)
        ? state.mutedChannels.filter(c => c !== id)
        : [...state.mutedChannels, id]
    },
    toggleMemberList(state) {
      state.memberListOpen = !state.memberListOpen
    },
    setTheme(state, action: PayloadAction<PrefsState['theme']>) {
      state.theme = action.payload
    },
    setNotificationSounds(state, action: PayloadAction<boolean>) {
      state.notificationSounds = action.payload
    },
    setDesktopNotifications(state, action: PayloadAction<boolean>) {
      state.desktopNotifications = action.payload
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
  setNotificationLevel,
  toggleChannelMute,
  toggleMemberList,
  setTheme,
  setNotificationSounds,
  setDesktopNotifications,
  setCompactMode,
  toggleMute,
  toggleDeafen,
} = prefsSlice.actions
export const prefsReducer = prefsSlice.reducer
