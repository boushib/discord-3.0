import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Modal =
  | { type: 'createServer' }
  | { type: 'createChannel'; serverId: string; categoryId: string | null }
  | { type: 'invite'; serverId: string }
  | { type: 'leaveServer'; serverId: string }
  | { type: 'deleteMessage'; channelId: string; messageId: string }
  | { type: 'settings' }
  | { type: 'quickSwitcher' }

export interface UIState {
  modal: Modal | null
  replyTo: Record<string, string>
  editing: { channelId: string; messageId: string } | null
  typing: Record<string, string[]>
  voice: { serverId: string; channelId: string } | null
  search: string
}

const initialState: UIState = {
  modal: null,
  replyTo: {},
  editing: null,
  typing: {},
  voice: null,
  search: '',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<Modal>) {
      state.modal = action.payload
    },
    closeModal(state) {
      state.modal = null
    },
    setReplyTo(state, action: PayloadAction<{ channelId: string; messageId: string | null }>) {
      const { channelId, messageId } = action.payload
      if (messageId) state.replyTo[channelId] = messageId
      else delete state.replyTo[channelId]
    },
    setEditing(state, action: PayloadAction<UIState['editing']>) {
      state.editing = action.payload
    },
    startTyping(state, action: PayloadAction<{ channelId: string; userId: string }>) {
      const list = (state.typing[action.payload.channelId] ??= [])
      if (!list.includes(action.payload.userId)) list.push(action.payload.userId)
    },
    stopTyping(state, action: PayloadAction<{ channelId: string; userId: string }>) {
      const list = state.typing[action.payload.channelId]
      if (list) state.typing[action.payload.channelId] = list.filter(id => id !== action.payload.userId)
    },
    setVoice(state, action: PayloadAction<UIState['voice']>) {
      state.voice = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
  },
})

export const {
  openModal,
  closeModal,
  setReplyTo,
  setEditing,
  startTyping,
  stopTyping,
  setVoice,
  setSearch,
} = uiSlice.actions
export const uiReducer = uiSlice.reducer
