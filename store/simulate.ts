import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import type { RootState } from '.'
import { sendMessage, toggleReaction } from './messages'
import { findChannel } from './selectors'
import { startTyping, stopTyping } from './ui'

type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const REPLIES: [RegExp, string[]][] = [
  [/\b(hi|hello|hey|yo|sup|gm|morning)\b/i, ['hey! 👋', 'yo', 'gm gm ☀️', 'hello!', 'heyy what’s up']],
  [/\b(thanks|thank you|thx|ty)\b/i, ['np!', 'anytime 🙌', 'of course!']],
  [/(lol|lmao|haha|😂|🤣)/i, ['😂😂', 'lmao', 'haha same', 'I’m crying 💀']],
  [/\b(bug|error|broken|crash)\b/i, ['have you tried turning it off and on again?', 'can you share a repro?', 'works on my machine™']],
  [/\b(next|react|typescript|code|deploy)\b/i, ['ship it 🚢', 'the App Router makes this way easier', 'did you check the docs in node_modules/next/dist/docs?']],
  [/\?\s*$/, ['good question 🤔', 'not sure tbh', 'I think so?', 'yes!', 'hmm, let me check', 'pretty sure the answer is yes']],
]

const GENERIC = [
  'nice',
  'true',
  '💯',
  'fr',
  'that’s awesome',
  'agreed',
  'wait really?',
  '+1',
  'I was just thinking the same thing',
  'this clone looks so real 👀',
]

const replyFor = (content: string) =>
  pick(REPLIES.find(([pattern]) => pattern.test(content))?.[1] ?? GENERIC)

/** After the current user posts, someone may start typing and respond */
export const simulateReply =
  (channelId: string, messageId: string, content: string): AppThunk =>
  (dispatch, getState) => {
    const state = getState()
    const context = findChannel(state, channelId)
    if (!context) return

    let candidates: string[]
    if (context.kind === 'dm') {
      const blocked = state.users.relationships.some(
        r => r.userId === context.recipient.id && r.type === 'blocked'
      )
      candidates = !blocked && context.recipient.status !== 'offline' ? [context.recipient.id] : []
    } else {
      candidates = context.server.members
        .map(m => state.users.byId[m.userId])
        .filter(u => u && u.id !== CURRENT_USER_ID && !u.bot && u.status === 'online')
        .map(u => u.id)
    }
    if (!candidates.length || Math.random() > (context.kind === 'dm' ? 0.95 : 0.7)) return

    const authorId = pick(candidates)
    const typingDelay = 700 + Math.random() * 1500
    const typingDuration = 1500 + Math.random() * 2500

    if (Math.random() < 0.35) {
      setTimeout(
        () =>
          dispatch(
            toggleReaction({ channelId, messageId, emoji: pick(['👍', '🔥', '😂', '❤️', '👀']), userId: authorId })
          ),
        typingDelay / 2
      )
    }

    setTimeout(() => dispatch(startTyping({ channelId, userId: authorId })), typingDelay)
    setTimeout(() => {
      dispatch(stopTyping({ channelId, userId: authorId }))
      dispatch(sendMessage({ channelId, authorId, content: replyFor(content) }))
    }, typingDelay + typingDuration)
  }
