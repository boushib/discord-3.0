import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { createSeedMessages } from '../constants/seed'
import { createThread, deleteThread } from './threads'
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
        poll?: Message['poll']
        forwarded?: Message['forwarded']
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
    votePoll(
      state,
      action: PayloadAction<{ channelId: string; messageId: string; optionId: string; userId: string }>
    ) {
      const { channelId, messageId, optionId, userId } = action.payload
      const poll = state[channelId]?.find(m => m.id === messageId)?.poll
      if (!poll || Date.now() > poll.endsAt) return
      const option = poll.options.find(o => o.id === optionId)
      if (!option) return
      if (option.voterIds.includes(userId)) {
        option.voterIds = option.voterIds.filter(id => id !== userId)
        return
      }
      // Single-choice polls move your vote instead of adding another
      if (!poll.multiple) for (const o of poll.options) o.voterIds = o.voterIds.filter(id => id !== userId)
      option.voterIds.push(userId)
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
  extraReducers: builder => {
    builder.addCase(createThread, (state, action) => {
      const { parentChannelId, parentMessageId, id } = action.payload
      const message = state[parentChannelId]?.find(m => m.id === parentMessageId)
      if (message) message.threadId = id
    })
    builder.addCase(deleteThread, (state, action) => {
      delete state[action.payload]
      for (const list of Object.values(state)) {
        for (const m of list) if (m.threadId === action.payload) delete m.threadId
      }
    })
  },
})

export const { sendMessage, editMessage, deleteMessage, toggleReaction, togglePin, claimGift, votePoll } =
  messagesSlice.actions
export const messagesReducer = messagesSlice.reducer
