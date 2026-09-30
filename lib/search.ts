import type { Message, User } from '../models'

export interface ParsedQuery {
  text: string
  from: string[]
  mentions: string[]
  in: string[]
  has: string[]
  pinned: boolean
}

const FILTER = /\b(from|mentions|in|has|pinned):(\S+)/gi

/** "from:kai has:link lineups" -> { from: ['kai'], has: ['link'], text: 'lineups' } */
export const parseQuery = (query: string): ParsedQuery => {
  const parsed: ParsedQuery = { text: '', from: [], mentions: [], in: [], has: [], pinned: false }
  const text = query.replace(FILTER, (_, key: string, value: string) => {
    const v = value.toLowerCase().replace(/^[@#]/, '')
    const k = key.toLowerCase()
    if (k === 'pinned') parsed.pinned = v === 'true' || v === 'yes'
    else (parsed[k as 'from' | 'mentions' | 'in' | 'has'] as string[]).push(v)
    return ''
  })
  parsed.text = text.trim().toLowerCase()
  return parsed
}

export const isEmptyQuery = (q: ParsedQuery) =>
  !q.text && !q.from.length && !q.mentions.length && !q.in.length && !q.has.length && !q.pinned

const matchesUser = (user: User | undefined, names: string[]) =>
  !!user && names.some(n => user.username.toLowerCase() === n || user.displayName.toLowerCase() === n)

const HAS: Record<string, (m: Message) => boolean> = {
  link: m => /https?:\/\//.test(m.content),
  image: m => !!m.attachments?.some(a => a.type.startsWith('image/')) || /\.(gif|png|jpe?g|webp)(\?|$)/i.test(m.content),
  file: m => !!m.attachments?.length,
  video: m => !!m.attachments?.some(a => a.type.startsWith('video/')),
  poll: m => !!m.poll,
  sticker: m => !!m.sticker,
}

export const matchMessage = (
  message: Message,
  q: ParsedQuery,
  users: Record<string, User>,
  channelName: string
) => {
  if (q.text && !message.content.toLowerCase().includes(q.text) && !message.poll?.question.toLowerCase().includes(q.text)) return false
  if (q.from.length && !matchesUser(users[message.authorId], q.from)) return false
  if (q.in.length && !q.in.includes(channelName.toLowerCase())) return false
  if (q.pinned && !message.pinned) return false
  if (q.has.length && !q.has.every(h => HAS[h]?.(message))) return false
  if (q.mentions.length) {
    const content = message.content.toLowerCase()
    if (!q.mentions.some(name => content.includes(`@${name}`))) return false
  }
  return true
}

export const SEARCH_FILTERS = [
  { key: 'from:', hint: 'user' },
  { key: 'mentions:', hint: 'user' },
  { key: 'in:', hint: 'channel' },
  { key: 'has:', hint: 'link, image, file, poll' },
  { key: 'pinned:', hint: 'true' },
]
