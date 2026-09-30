import type {
  Channel,
  DMChannel,
  Message,
  Relationship,
  Server,
  User,
} from '../models'
import { CURRENT_USER_ID } from '.'

const MINUTE = 60 * 1000

const u = (
  id: string,
  username: string,
  displayName: string,
  avatarColor: number,
  status: User['status'],
  extra: Partial<User> = {}
): User => ({
  id,
  username,
  displayName,
  avatarColor,
  status,
  createdAt: Date.UTC(2019 + (avatarColor % 5), avatarColor * 2, 4 + avatarColor),
  ...extra,
})

export const SEED_USERS: User[] = [
  u(CURRENT_USER_ID, 'boushib', 'Boushib', 0, 'online', {
    customStatus: 'Building a Discord clone',
    bio: 'Full-stack dev. I break things so you don’t have to.',
    bannerColor: '#5865f2',
    createdAt: Date.UTC(2017, 3, 12),
  }),
  u('u-ironman', 'ironman', 'IronMan', 4, 'online', {
    customStatus: 'I am Iron Man',
    bio: 'Genius, billionaire, playboy, philanthropist.',
    bannerColor: '#b91c1c',
  }),
  u('u-mustapha', 'mustapha', 'Mustapha', 2, 'online', {
    bio: 'Community lead 🏀',
    bannerColor: '#16a34a',
  }),
  u('u-luke', 'luke.sky', 'Luke', 1, 'idle', { customStatus: 'On Tatooine' }),
  u('u-john', 'john_doe', 'John', 3, 'dnd', { customStatus: 'Heads down' }),
  u('u-sarah', 'sarahcodes', 'Sarah', 5, 'online', {
    customStatus: '☕ refactoring',
    bio: 'Frontend engineer. CSS is my love language.',
    bannerColor: '#db2777',
  }),
  u('u-kai', 'kai', 'Kai', 0, 'online'),
  u('u-nina', 'nina.w', 'Nina', 2, 'idle'),
  u('u-omar', 'omar_dev', 'Omar', 3, 'online', { customStatus: 'Shipping 🚢' }),
  u('u-leo', 'leo', 'Leo', 4, 'offline'),
  u('u-mia', 'mia', 'Mia', 5, 'offline'),
  u('u-zed', 'zed', 'Zed', 1, 'dnd'),
  u('u-ava', 'ava.gg', 'Ava', 0, 'online'),
  u('u-noah', 'noah', 'Noah', 2, 'offline'),
  u('u-ella', 'ella', 'Ella', 3, 'idle'),
  u('u-mod', 'automod', 'AutoMod', 0, 'online', {
    bot: true,
    bio: 'I keep things tidy around here.',
  }),
]

const ch = (
  id: string,
  name: string,
  categoryId: string | null,
  type: Channel['type'] = 'text',
  topic?: string
): Channel => ({ id, name, type, categoryId, topic })

const members = (ids: string[], roles: Record<string, string[]> = {}) =>
  ids.map((userId, i) => ({
    userId,
    roleIds: roles[userId] ?? [],
    joinedAt: Date.UTC(2021, i % 12, 1 + i),
  }))

const ALL_IDS = SEED_USERS.map(x => x.id)

export const SEED_SERVERS: Server[] = [
  {
    id: 's-dapper',
    name: 'Dapper Community',
    icon: 'https://cdn.discordapp.com/icons/943191925727567882/a_33c85fdf14a13b79a5bcb51e4ff78a63.webp?size=240',
    bannerColor: '#7c3aed',
    verified: true,
    ownerId: 'u-mustapha',
    categories: [
      { id: 'cat-dapper-info', name: 'Information' },
      { id: 'cat-dapper-chat', name: 'Community' },
      { id: 'cat-dapper-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-dapper-announcements', 'announcements', 'cat-dapper-info', 'announcement', 'Official news from the Dapper team'),
      ch('c-dapper-rules', 'rules', 'cat-dapper-info', 'text', 'Read before posting'),
      ch('c-dapper-general', 'general', 'cat-dapper-chat', 'text', 'Chat about anything Dapper related 🌵'),
      ch('c-dapper-challenges', 'challenges', 'cat-dapper-chat', 'text', 'Weekly challenges and leaderboards'),
      ch('c-dapper-office-hours', 'office-hours', 'cat-dapper-chat', 'text', 'Ask the team anything, Thursdays 5pm PT'),
      ch('c-dapper-nba', 'nba', 'cat-dapper-chat'),
      ch('c-dapper-wnba', 'wnba', 'cat-dapper-chat'),
      ch('c-dapper-lounge', 'Lounge', 'cat-dapper-voice', 'voice'),
      ch('c-dapper-stage', 'Office Hours Stage', 'cat-dapper-voice', 'voice'),
    ],
    roles: [
      { id: 'r-dapper-team', name: 'Team', color: '#f47b67', hoist: true },
      { id: 'r-dapper-mod', name: 'Moderator', color: '#3ba55c', hoist: true },
      { id: 'r-dapper-collector', name: 'Collector', color: '#faa61a', hoist: false },
    ],
    members: members(ALL_IDS, {
      'u-mustapha': ['r-dapper-team'],
      'u-luke': ['r-dapper-team'],
      'u-john': ['r-dapper-team'],
      'u-sarah': ['r-dapper-mod'],
      'u-mod': ['r-dapper-mod'],
      'u-ironman': ['r-dapper-collector'],
      [CURRENT_USER_ID]: ['r-dapper-collector'],
    }),
    voiceStates: {
      'c-dapper-lounge': ['u-kai', 'u-omar'],
    },
  },
  {
    id: 's-topshot',
    name: 'NBA Top Shot',
    icon: 'https://cdn.discordapp.com/icons/606111887876292622/a_9f046f4d8fbc8d744152c54f63f439cf.webp?size=240',
    bannerColor: '#1d4ed8',
    verified: true,
    ownerId: 'u-mustapha',
    categories: [
      { id: 'cat-ts-info', name: 'Welcome' },
      { id: 'cat-ts-chat', name: 'Top Shot' },
      { id: 'cat-ts-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-ts-announcements', 'announcements', 'cat-ts-info', 'announcement'),
      ch('c-ts-general', 'general', 'cat-ts-chat', 'text', 'Talk hoops and moments 🏀'),
      ch('c-ts-drops', 'pack-drops', 'cat-ts-chat', 'text', 'Drop schedules and queue talk'),
      ch('c-ts-trading', 'trading', 'cat-ts-chat', 'text', 'Trade offers. Be respectful.'),
      ch('c-ts-voice', 'Courtside', 'cat-ts-voice', 'voice'),
    ],
    roles: [
      { id: 'r-ts-staff', name: 'Staff', color: '#5865f2', hoist: true },
      { id: 'r-ts-baller', name: 'Baller', color: '#eb459e', hoist: false },
    ],
    members: members(ALL_IDS.slice(0, 12), {
      'u-mustapha': ['r-ts-staff'],
      'u-ironman': ['r-ts-baller'],
    }),
    voiceStates: {},
  },
  {
    id: 's-nextjs',
    name: 'Next.js',
    bannerColor: '#111827',
    ownerId: 'u-sarah',
    categories: [
      { id: 'cat-next-general', name: 'General' },
      { id: 'cat-next-help', name: 'Help' },
      { id: 'cat-next-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-next-announcements', 'announcements', 'cat-next-general', 'announcement', 'Release notes and news'),
      ch('c-next-general', 'general', 'cat-next-general', 'text', 'General Next.js discussion'),
      ch('c-next-showcase', 'showcase', 'cat-next-general', 'text', 'Show off what you built'),
      ch('c-next-help', 'help-forum', 'cat-next-help', 'text', 'Ask questions. Include a repro!'),
      ch('c-next-app-router', 'app-router', 'cat-next-help', 'text', 'Layouts, server components, caching'),
      ch('c-next-pairing', 'Pairing Room', 'cat-next-voice', 'voice'),
    ],
    roles: [
      { id: 'r-next-core', name: 'Core Team', color: '#f2f3f5', hoist: true },
      { id: 'r-next-helper', name: 'Helper', color: '#00a8fc', hoist: true },
    ],
    members: members(
      [CURRENT_USER_ID, 'u-sarah', 'u-kai', 'u-omar', 'u-ava', 'u-nina', 'u-leo', 'u-zed', 'u-mod'],
      {
        'u-sarah': ['r-next-core'],
        'u-omar': ['r-next-helper'],
        'u-kai': ['r-next-helper'],
      }
    ),
    voiceStates: {
      'c-next-pairing': ['u-sarah'],
    },
  },
  {
    id: 's-nflallday',
    name: 'NFL All Day',
    icon: 'https://cdn.discordapp.com/icons/885605337925828618/68c787625b073ac1bb2f2496025bff05.webp?size=240',
    ownerId: 'u-john',
    categories: [{ id: 'cat-nfl', name: 'Text Channels' }, { id: 'cat-nfl-v', name: 'Voice Channels' }],
    channels: [
      ch('c-nfl-general', 'general', 'cat-nfl', 'text', 'Football talk 🏈'),
      ch('c-nfl-gameday', 'gameday', 'cat-nfl'),
      ch('c-nfl-voice', 'General', 'cat-nfl-v', 'voice'),
    ],
    roles: [],
    members: members(ALL_IDS.slice(0, 9)),
    voiceStates: {},
  },
  {
    id: 's-eternal',
    name: 'Eternal',
    icon: 'https://cdn.discordapp.com/icons/831590473595879446/436041d69db87eac7c5a18384b0bc7ff.webp?size=240',
    ownerId: 'u-ava',
    categories: [{ id: 'cat-et', name: 'Text Channels' }, { id: 'cat-et-v', name: 'Voice Channels' }],
    channels: [
      ch('c-et-general', 'general', 'cat-et'),
      ch('c-et-memes', 'memes', 'cat-et', 'text', 'Low effort, high reward'),
      ch('c-et-voice', 'Hangout', 'cat-et-v', 'voice'),
    ],
    roles: [],
    members: members([CURRENT_USER_ID, 'u-ava', 'u-zed', 'u-ella', 'u-noah', 'u-mia']),
    voiceStates: { 'c-et-voice': ['u-zed', 'u-ella', 'u-noah'] },
  },
  {
    id: 's-ac',
    name: "Assassin's Creed",
    icon: 'https://cdn.discordapp.com/icons/215838530889318401/761c4e7c15397b59b227168a6f692075.webp?size=240',
    verified: true,
    ownerId: 'u-leo',
    categories: [{ id: 'cat-ac', name: 'Brotherhood' }],
    channels: [
      ch('c-ac-general', 'general', 'cat-ac', 'text', 'Nothing is true, everything is permitted'),
      ch('c-ac-screenshots', 'screenshots', 'cat-ac'),
    ],
    roles: [],
    members: members([CURRENT_USER_ID, 'u-leo', 'u-mia', 'u-luke', 'u-john']),
    voiceStates: {},
  },
  {
    id: 's-rl',
    name: 'Rocket League',
    icon: 'https://external-preview.redd.it/fF3j2lwIwYWKKJJhyvdl_Oa_iYJtgVNV4jilcYrQiBE.jpg?auto=webp&s=e2b17d9eb8c59afc8c65b01dc0138f9fb4ae41ea',
    ownerId: 'u-kai',
    categories: [{ id: 'cat-rl', name: 'Text Channels' }, { id: 'cat-rl-v', name: 'Voice Channels' }],
    channels: [
      ch('c-rl-general', 'general', 'cat-rl'),
      ch('c-rl-lfg', 'looking-for-group', 'cat-rl', 'text', 'Find teammates. Include rank + region.'),
      ch('c-rl-voice', 'Ranked 2v2', 'cat-rl-v', 'voice'),
    ],
    roles: [],
    members: members([CURRENT_USER_ID, 'u-kai', 'u-omar', 'u-ava', 'u-zed']),
    voiceStates: {},
  },
]

export const SEED_DMS: DMChannel[] = [
  { id: 'dm-sarah', recipientId: 'u-sarah' },
  { id: 'dm-ironman', recipientId: 'u-ironman' },
  { id: 'dm-kai', recipientId: 'u-kai' },
  { id: 'dm-luke', recipientId: 'u-luke' },
]

export const SEED_RELATIONSHIPS: Relationship[] = [
  { userId: 'u-sarah', type: 'friend' },
  { userId: 'u-ironman', type: 'friend' },
  { userId: 'u-kai', type: 'friend' },
  { userId: 'u-luke', type: 'friend' },
  { userId: 'u-omar', type: 'friend' },
  { userId: 'u-nina', type: 'friend' },
  { userId: 'u-leo', type: 'friend' },
  { userId: 'u-mia', type: 'friend' },
  { userId: 'u-ava', type: 'incoming' },
  { userId: 'u-noah', type: 'outgoing' },
  { userId: 'u-zed', type: 'blocked' },
]

type SeedLine = [authorId: string, content: string, minutesAgo: number, extra?: Partial<Message>]

const SEED_CONVERSATIONS: Record<string, SeedLine[]> = {
  'c-dapper-general': [
    ['u-luke', 'Morning everyone ☀️', 26 * 60 + 12],
    ['u-kai', 'gm gm', 26 * 60 + 10],
    ['u-mustapha', 'Reminder: office hours are moving to **Thursday 5pm PT** this week. See #office-hours for details.', 26 * 60, { pinned: true, reactions: [{ emoji: '👍', userIds: ['u-kai', 'u-luke', 'u-sarah'] }] }],
    ['u-ironman', 'Does anyone remember if they are postponing the Legendary Rookie Revelation drop, or did they scrap it all together?', 95],
    ['u-sarah', 'Postponed afaik. They said it would be back "soon™"', 93],
    ['u-ironman', 'soon™ is doing a lot of heavy lifting there 😂', 92, { reactions: [{ emoji: '😂', userIds: ['u-sarah', 'u-kai', CURRENT_USER_ID] }] }],
    ['u-ironman', 'guess I’ll hold on to my budget then', 91],
    ['u-omar', 'Just pulled a *Common* but it’s a serial under 100 so I’m happy', 60],
    ['u-mustapha', 'Nice pull! Low serials are always worth holding', 58],
    ['u-nina', 'is anyone else getting stuck in the queue? spinner has been going for 10 min', 30],
    ['u-mod', 'Heads up: the queue is currently experiencing high traffic. Please do not refresh — you will lose your place.', 29],
    ['u-nina', 'ah ok ty', 28],
    ['u-kai', 'Pro tip: `Ctrl+K` lets you jump between channels fast in this clone 👀', 12, { reactions: [{ emoji: '🔥', userIds: ['u-omar'] }] }],
    ['u-sarah', 'Who’s joining the Lounge voice channel later?', 4],
  ],
  'c-dapper-announcements': [
    ['u-mustapha', '## Season 3 is here 🎉\nNew challenges, new rewards, and a revamped leaderboard. Check #challenges for the full breakdown.', 3 * 24 * 60, { reactions: [{ emoji: '🎉', userIds: ['u-kai', 'u-sarah', 'u-ironman', 'u-omar'] }, { emoji: '❤️', userIds: ['u-luke'] }] }],
    ['u-mustapha', 'Maintenance window tonight from **11pm–1am PT**. The marketplace will be read-only during that time.', 20 * 60],
  ],
  'c-dapper-rules': [
    ['u-mod', '**1.** Be respectful. No harassment, hate speech or personal attacks.\n**2.** No spam or self-promotion.\n**3.** Keep discussions in the relevant channel.\n**4.** Never share your seed phrase or password. Staff will __never__ DM you first.\n**5.** Have fun ✨', 30 * 24 * 60, { pinned: true }],
  ],
  'c-dapper-challenges': [
    ['u-luke', 'This week’s challenge: collect any 3 moments from the **2024 Playoffs** set. Reward: exclusive badge 🏅', 2 * 24 * 60],
    ['u-omar', 'done ✅ that was quick', 2 * 24 * 60 - 30],
    ['u-kai', 'still need one more… prices went up fast', 24 * 60],
  ],
  'c-dapper-office-hours': [
    ['u-john', 'Drop your questions here ahead of Thursday and we’ll go through them live.', 4 * 24 * 60],
    ['u-ava', 'Will there be a mobile app for the marketplace?', 3 * 24 * 60],
  ],
  'c-ts-general': [
    ['u-ironman', 'That dunk last night was unreal', 180],
    ['u-mustapha', 'Moment of the year contender for sure', 175],
    ['u-kai', 'Top Shot needs to mint that ASAP', 170],
    ['u-omar', '> Top Shot needs to mint that ASAP\nhard agree', 165],
  ],
  'c-ts-drops': [
    ['u-mustapha', 'Next pack drop: **Friday 9am PT**. Queue opens 30 minutes early.', 10 * 60, { pinned: true }],
  ],
  'c-next-general': [
    ['u-sarah', 'Next.js 16 is out! Turbopack is now the default for both `next dev` and `next build` 🚀', 2 * 24 * 60, { reactions: [{ emoji: '🚀', userIds: ['u-kai', 'u-omar', CURRENT_USER_ID] }] }],
    ['u-kai', 'Finally. Build times on our monorepo dropped by half', 2 * 24 * 60 - 20],
    ['u-omar', 'Heads up if you’re upgrading: `next lint` is gone, switch to the ESLint CLI with a flat config', 25 * 60],
    ['u-ava', 'and `params` is async-only now, so:\n```tsx\nexport default async function Page({ params }) {\n  const { slug } = await params\n  return <h1>{slug}</h1>\n}\n```', 24 * 60],
    ['u-sarah', 'Good summary. The upgrade guide in `node_modules/next/dist/docs` covers the rest', 23 * 60],
    ['u-nina', 'Has anyone tried the React Compiler with it yet?', 45],
    ['u-kai', 'Yeah, works great. Just set `reactCompiler: true` in next.config.ts', 40],
  ],
  'c-next-help': [
    ['u-leo', 'Getting `Error: Cannot call impure function during render` from the linter, what does that mean?', 5 * 60],
    ['u-omar', 'You’re probably calling `Math.random()` or `Date.now()` in a component body. Move it into an effect or event handler — otherwise server and client renders won’t match.', 5 * 60 - 12, { reactions: [{ emoji: '🙏', userIds: ['u-leo'] }] }],
  ],
  'c-next-showcase': [
    ['u-ava', 'Built a trading journal with the App Router + server actions, pretty happy with it', 3 * 24 * 60],
  ],
  'c-et-memes': [
    ['u-zed', 'me: I’ll just fix one small bug\nalso me, 6 hours later: rewriting the entire state layer', 90],
    ['u-ella', 'every. single. time.', 85, { reactions: [{ emoji: '💀', userIds: ['u-zed', 'u-noah'] }] }],
  ],
  'c-rl-lfg': [
    ['u-kai', 'Diamond 2, NA East, looking for a 2s partner tonight', 120],
    ['u-omar', 'I’m down, add me', 110],
  ],
  'dm-sarah': [
    ['u-sarah', 'hey! did you see the PR comments?', 26 * 60],
    [CURRENT_USER_ID, 'yep, fixing them now', 26 * 60 - 5],
    ['u-sarah', 'no rush 🙂', 26 * 60 - 4],
    ['u-sarah', 'btw the new Discord clone looks sick', 20],
  ],
  'dm-ironman': [
    ['u-ironman', 'Want to split a pack on Friday?', 3 * 60],
  ],
  'dm-kai': [
    [CURRENT_USER_ID, 'gg last night', 2 * 24 * 60],
    ['u-kai', 'gg! rematch this weekend?', 2 * 24 * 60 - 60],
  ],
}

export const createSeedMessages = (now: number): Record<string, Message[]> =>
  Object.fromEntries(
    Object.entries(SEED_CONVERSATIONS).map(([channelId, lines]) => [
      channelId,
      lines.map(([authorId, content, minutesAgo, extra], i) => ({
        id: `m-${channelId}-${i}`,
        channelId,
        authorId,
        content,
        createdAt: now - minutesAgo * MINUTE,
        reactions: [],
        ...extra,
      })),
    ])
  )

/** Channels that start with unread messages */
export const SEED_UNREAD = ['c-ts-general', 'c-dapper-announcements', 'dm-sarah', 'c-et-memes']
