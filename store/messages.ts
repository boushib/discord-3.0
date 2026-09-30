import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { createSeedMessages } from '../constants/seed'
import type { Attachment, Message } from '../models'

export type MessagesState = Record<string, Message[]>

const messagesSlice = createSlice({
  name: 'messages',
  initialState: (): MessagesState => createSeedMessages(Date.now()),
  reducers: {
    sendMessage: {
      reducer(state, action: PayloadAction<Message>) {
        ;(state[action.payload.channelId] ??= []).push(action.payload)
      },
      prepare(input: {
        channelId: string
        authorId: string
        content: string
        replyToId?: string
        attachments?: Attachment[]
        sticker?: Message['sticker']
        gift?: Message['gift']
      }) {
        return {
          payload: {
            id: `m-${nanoid(10)}`,
            reactions: [],
            createdAt: Date.now(),
            ...input,
          } satisfies Message,
        }
      },
    },
    editMessage: {
      reducer(
        state,
        action: PayloadAction<{ channelId: string; messageId: string; content: string; editedAt: number }>
      ) {
        const { channelId, messageId, content, editedAt } = action.payload
        const message = state[channelId]?.find(m => m.id === messageId)
        if (message) {
          message.content = content
          message.editedAt = editedAt
        }
      },
      prepare(input: { channelId: string; messageId: string; content: string }) {
        return { payload: { ...input, editedAt: Date.now() } }
      },
    },
    deleteMessage(state, action: PayloadAction<{ channelId: string; messageId: string }>) {
      const { channelId, messageId } = action.payload
      state[channelId] = (state[channelId] ?? []).filter(m => m.id !== messageId)
    },
    toggleReaction(
      state,
      action: PayloadAction<{ channelId: string; messageId: string; emoji: string; userId: string }>
    ) {
      const { channelId, messageId, emoji, userId } = action.payload
      const message = state[channelId]?.find(m => m.id === messageId)
      if (!message) return
      const reaction = message.reactions.find(r => r.emoji === emoji)
      if (!reaction) {
        message.reactions.push({ emoji, userIds: [userId] })
      } else if (reaction.userIds.includes(userId)) {
        reaction.userIds = reaction.userIds.filter(id => id !== userId)
        if (!reaction.userIds.length) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji)
        }
      } else {
        reaction.userIds.push(userId)
      }
    },
    claimGift(state, action: PayloadAction<{ channelId: string; messageId: string; userId: string }>) {
      const message = state[action.payload.channelId]?.find(m => m.id === action.payload.messageId)
      if (message?.gift && !message.gift.claimedBy) message.gift.claimedBy = action.payload.userId
    },
    togglePin(state, action: PayloadAction<{ channelId: string; messageId: string }>) {
      const message = state[action.payload.channelId]?.find(m => m.id === action.payload.messageId)
      if (message) message.pinned = !message.pinned
    },
  },
})

export const { sendMessage, editMessage, deleteMessage, toggleReaction, togglePin, claimGift } =
  messagesSlice.actions
export const messagesReducer = messagesSlice.reducer
