import type { CustomEmoji } from '../models'

/** Discord's custom emoji token: <:name:id> */
export const CUSTOM_EMOJI = /<:([a-z0-9_]{2,32}):([\w-]+)>/g
export const isCustomEmojiToken = (s: string) => /^<:[a-z0-9_]{2,32}:[\w-]+>$/.test(s)
export const customEmojiToken = (emoji: Pick<CustomEmoji, 'id' | 'name'>) => `<:${emoji.name}:${emoji.id}>`
export const parseCustomEmojiToken = (token: string) => {
  const m = /^<:([a-z0-9_]{2,32}):([\w-]+)>$/.exec(token)
  return m ? { name: m[1], id: m[2] } : null
}

/** ":creeper:" -> "<:creeper:e-123>" for emoji you have access to (first match wins) */
export const replaceCustomShortcodes = (text: string, emojis: CustomEmoji[]) => {
  if (!emojis.length) return text
  const byName = new Map<string, CustomEmoji>()
  for (const e of emojis) if (!byName.has(e.name)) byName.set(e.name, e)
  return text.replace(/(?<!<):([a-z0-9_]{2,32}):(?![\w-]*>)/g, (match, name: string) => {
    const emoji = byName.get(name)
    return emoji ? customEmojiToken(emoji) : match
  })
}
