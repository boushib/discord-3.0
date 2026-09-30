export const CURRENT_USER_ID = 'u-me'

/** Discord's default avatar background colors */
export const AVATAR_COLORS = [
  '#5865f2',
  '#757e8a',
  '#3ba55c',
  '#faa61a',
  '#ed4245',
  '#eb459e',
]

export const STATUS_LABELS = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Invisible',
} as const

/** Consecutive messages from the same author within this window are grouped */
export const MESSAGE_GROUP_WINDOW = 7 * 60 * 1000

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '👀', '🎉']

export const LOADING_TIPS = [
  'You can type /tableflip and /unflip to spice up your messages.',
  'Press Ctrl+K (⌘K on Mac) to quickly jump to any channel or DM.',
  'Hover a message and click the smiley to add a reaction.',
  'Wrap text in **double asterisks** to make it bold.',
  'Use ||spoiler tags|| to hide text until someone clicks it.',
  'Press Escape to cancel a reply or an edit.',
  'Click a member in the list to see their profile.',
]
