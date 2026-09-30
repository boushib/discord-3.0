export interface Gif {
  id: string
  label: string
  tags: string
}

// Curated Giphy GIFs (search needs an API key, so the picker ships a fixed set)
export const GIFS: Gif[] = [
  { id: 'JIX9t2j0ZTN9S', label: 'Cat typing', tags: 'cat typing work busy computer' },
  { id: 'Ju7l5y9osyymQ', label: 'Rickroll', tags: 'rick roll never gonna give you up music' },
  { id: '111ebonMs90YLu', label: 'Thumbs up', tags: 'thumbs up ok yes good nice' },
  { id: '3o7TKSjRrfIPjeiVyM', label: 'Mind blown', tags: 'mind blown wow amazing space' },
  { id: '26ufdipQqU2lhNA4g', label: 'Mind blown', tags: 'mind blown wow shocked' },
  { id: '13CoXDiaCcCoyk', label: 'Cat', tags: 'cat cute pounce' },
  { id: '5VKbvrjxpVJCM', label: 'Shocked', tags: 'shocked surprised omg what' },
  { id: 'g9582DNuQppxC', label: 'Cheers', tags: 'cheers toast congrats party celebrate' },
  { id: 'l41lFw057lAJQMwg0', label: 'Panic', tags: 'panic scared help stress' },
  { id: 'l2JehQ2GitHGdVG9y', label: 'Nope', tags: 'nope no leave bye' },
  { id: '3o72FcJmLzIdYJdmDe', label: 'Applause', tags: 'applause clap bravo crowd' },
  { id: 'fxsqOYnIMEefC', label: 'Excited', tags: 'excited happy yay minions' },
  { id: 'YRuFixSNWFVcXaxpmX', label: 'Slow clap', tags: 'slow clap well done bravo' },
  { id: '26gsjCZpPolPr3sBy', label: 'Thank you', tags: 'thank you thanks ty grateful' },
]

export const gifPreview = (id: string) => `https://media.giphy.com/media/${id}/200w.gif`
export const gifUrl = (id: string) => `https://media.giphy.com/media/${id}/giphy.gif`

export interface Sticker {
  id: string
  name: string
  emoji: string
}

export const STICKERS: Sticker[] = [
  { id: 'wave', name: 'Wumpus Wave', emoji: '👋' },
  { id: 'party', name: 'Party Time', emoji: '🥳' },
  { id: 'gg', name: 'GG', emoji: '🏆' },
  { id: 'love', name: 'Big Love', emoji: '💖' },
  { id: 'lol', name: 'LOL', emoji: '🤣' },
  { id: 'hype', name: 'Hype', emoji: '🔥' },
  { id: 'coffee', name: 'Coffee Break', emoji: '☕' },
  { id: 'ship', name: 'Ship It', emoji: '🚢' },
  { id: 'think', name: 'Big Brain', emoji: '🧠' },
  { id: 'sleep', name: 'Sleepy', emoji: '😴' },
  { id: 'cry', name: 'Sad Wumpus', emoji: '😭' },
  { id: 'rocket', name: 'To The Moon', emoji: '🚀' },
]

export type GiftPlan = 'Nitro' | 'Nitro Basic'
