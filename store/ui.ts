import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Attachment } from '../models'

export type Modal =
  | { type: 'createServer' }
  | { type: 'createChannel'; serverId: string; categoryId: string | null }
  | { type: 'invite'; serverId: string }
  | { type: 'editChannel'; serverId: string; channelId: string }
  | { type: 'leaveServer'; serverId: string }
  | { type: 'deleteMessage'; channelId: string; messageId: string }
  | { type: 'settings' }
  | { type: 'serverSettings'; serverId: string }
  | { type: 'gift'; channelId: string }
  | { type: 'quickSwitcher' }
  | { type: 'shortcuts' }
  | { type: 'download' }

export interface UIState {
  modal: Modal | null
  replyTo: Record<string, string>
  editing: { channelId: string; messageId: string } | null
  typing: Record<string, string[]>
  /** Current call; serverId is '@me' for DM calls */
  voice: { serverId: string; channelId: string; startedAt: number } | null
  search: string
  mobileNavOpen: boolean
  /** Thread open in the side panel */
  openThreadId: string | null
  /** Files attached in the composer but not sent yet, per channel */
  uploads: Record<string, Attachment[]>
}

const initialState: UIState = {
  modal: null,
  replyTo: {},
  editing: null,
  typing: {},
  voice: null,
  search: '',
  mobileNavOpen: false,
  openThreadId: null,
  uploads: {},
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
    setOpenThread(state, action: PayloadAction<string | null>) {
      state.openThreadId = action.payload
    },
    setMobileNav(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload
    },
    addUploads(state, action: PayloadAction<{ channelId: string; attachments: Attachment[] }>) {
      const list = (state.uploads[action.payload.channelId] ??= [])
      list.push(...action.payload.attachments.slice(0, 10 - list.length))
    },
    removeUpload(state, action: PayloadAction<{ channelId: string; id: string }>) {
      const list = state.uploads[action.payload.channelId]
      if (list) state.uploads[action.payload.channelId] = list.filter(a => a.id !== action.payload.id)
    },
    clearUploads(state, action: PayloadAction<string>) {
      delete state.uploads[action.payload]
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
  setMobileNav,
  setOpenThread,
  addUploads,
  removeUpload,
  clearUploads,
} = uiSlice.actions
export const uiReducer = uiSlice.reducer
