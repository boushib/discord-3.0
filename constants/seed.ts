import type {
  Channel,
  Thread,
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
    email: 'boushib@example.com',
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
    premium: true,
    decoration: 'aurora',
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
    id: 's-minecraft',
    name: 'Minecraft',
    icon: '/servers/minecraft.svg',
    bannerColor: '#3f7a2a',
    verified: true,
    ownerId: 'u-kai',
    categories: [
      { id: 'cat-mc-info', name: 'Information' },
      { id: 'cat-mc-chat', name: 'Community' },
      { id: 'cat-mc-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-mc-announcements', 'announcements', 'cat-mc-info', 'announcement', 'Updates, snapshots and events'),
      ch('c-mc-rules', 'rules', 'cat-mc-info'),
      ch('c-mc-general', 'general', 'cat-mc-chat', 'text', 'Talk about anything Minecraft ⛏️'),
      ch('c-mc-builds', 'build-showcase', 'cat-mc-chat', 'text', 'Show off your builds. Screenshots encouraged!'),
      ch('c-mc-redstone', 'redstone', 'cat-mc-chat', 'text', 'Contraptions, farms and circuits'),
      ch('c-mc-servers', 'servers-and-realms', 'cat-mc-chat', 'text', 'Find a server or advertise your Realm'),
      ch('c-mc-mods', 'mods-and-shaders', 'cat-mc-chat'),
      ch('c-mc-smp', 'Survival SMP', 'cat-mc-voice', 'voice'),
      ch('c-mc-creative', 'Creative Build', 'cat-mc-voice', 'voice'),
    ],
    roles: [
      { id: 'r-mc-staff', name: 'Staff', color: '#55aa55', hoist: true },
      { id: 'r-mc-builder', name: 'Master Builder', color: '#c27c0e', hoist: true },
      { id: 'r-mc-redstoner', name: 'Redstoner', color: '#e74c3c', hoist: false },
    ],
    members: members(ALL_IDS, {
      'u-kai': ['r-mc-staff'],
      'u-nina': ['r-mc-staff'],
      'u-omar': ['r-mc-builder'],
      'u-ava': ['r-mc-builder'],
      'u-leo': ['r-mc-redstoner'],
      [CURRENT_USER_ID]: ['r-mc-redstoner'],
    }),
    voiceStates: { 'c-mc-smp': ['u-omar', 'u-ava', 'u-leo'] },
  },
  {
    id: 's-valorant',
    name: 'Valorant',
    icon: '/servers/valorant.svg',
    bannerColor: '#ff4655',
    verified: true,
    ownerId: 'u-zed',
    categories: [
      { id: 'cat-val-info', name: 'Information' },
      { id: 'cat-val-chat', name: 'Community' },
      { id: 'cat-val-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-val-patch', 'patch-notes', 'cat-val-info', 'announcement', 'Official patch notes'),
      ch('c-val-general', 'general', 'cat-val-chat', 'text', 'General Valorant chat'),
      ch('c-val-lfg', 'lfg', 'cat-val-chat', 'text', 'Looking for group — include rank, region and role'),
      ch('c-val-clips', 'clips', 'cat-val-chat', 'text', 'Aces, clutches and whiffs'),
      ch('c-val-strats', 'agents-and-strats', 'cat-val-chat', 'text', 'Lineups, comps and agent talk'),
      ch('c-val-ranked', 'Ranked 5-Stack', 'cat-val-voice', 'voice'),
      ch('c-val-unrated', 'Unrated', 'cat-val-voice', 'voice'),
    ],
    roles: [
      { id: 'r-val-mod', name: 'Moderator', color: '#3ba55c', hoist: true },
      { id: 'r-val-radiant', name: 'Radiant', color: '#ffdd66', hoist: true },
      { id: 'r-val-immortal', name: 'Immortal', color: '#e91e63', hoist: false },
    ],
    members: members(ALL_IDS.slice(0, 13), {
      'u-zed': ['r-val-mod'],
      'u-mod': ['r-val-mod'],
      'u-ironman': ['r-val-radiant'],
      'u-kai': ['r-val-immortal'],
    }),
    voiceStates: { 'c-val-ranked': ['u-zed', 'u-ironman'] },
  },
  {
    id: 's-fortnite',
    name: 'Fortnite',
    icon: '/servers/fortnite.svg',
    bannerColor: '#5b2bd6',
    verified: true,
    ownerId: 'u-luke',
    categories: [
      { id: 'cat-fn-info', name: 'Information' },
      { id: 'cat-fn-chat', name: 'Community' },
      { id: 'cat-fn-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-fn-news', 'news', 'cat-fn-info', 'announcement', 'Season updates and live events'),
      ch('c-fn-general', 'general', 'cat-fn-chat', 'text', 'Where we droppin’?'),
      ch('c-fn-shop', 'item-shop', 'cat-fn-chat', 'text', 'Today’s shop, rate the skins'),
      ch('c-fn-creative', 'creative-maps', 'cat-fn-chat', 'text', 'Share island codes'),
      ch('c-fn-squad', 'squad-up', 'cat-fn-chat', 'text', 'Find a squad'),
      ch('c-fn-squad1', 'Squad 1', 'cat-fn-voice', 'voice'),
      ch('c-fn-squad2', 'Squad 2', 'cat-fn-voice', 'voice'),
    ],
    roles: [
      { id: 'r-fn-mod', name: 'Moderator', color: '#1ca0f2', hoist: true },
      { id: 'r-fn-champ', name: 'Champion', color: '#9b59b6', hoist: false },
    ],
    members: members(ALL_IDS.slice(0, 12), {
      'u-luke': ['r-fn-mod'],
      'u-sarah': ['r-fn-champ'],
      'u-john': ['r-fn-champ'],
    }),
    voiceStates: {},
  },
  {
    id: 's-league',
    name: 'League of Legends',
    icon: '/servers/league.svg',
    bannerColor: '#0a1428',
    verified: true,
    ownerId: 'u-john',
    categories: [
      { id: 'cat-lol-info', name: 'Information' },
      { id: 'cat-lol-chat', name: 'Summoner’s Rift' },
      { id: 'cat-lol-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-lol-announcements', 'announcements', 'cat-lol-info', 'announcement', 'Patch notes and esports'),
      ch('c-lol-general', 'general', 'cat-lol-chat', 'text', 'GLHF 🗡️'),
      ch('c-lol-champs', 'champion-discussion', 'cat-lol-chat', 'text', 'Builds, runes and matchups'),
      ch('c-lol-esports', 'esports', 'cat-lol-chat', 'text', 'Worlds, LCS, LEC and more'),
      ch('c-lol-duo', 'find-a-duo', 'cat-lol-chat'),
      ch('c-lol-flex', 'Flex Queue', 'cat-lol-voice', 'voice'),
      ch('c-lol-aram', 'ARAM', 'cat-lol-voice', 'voice'),
    ],
    roles: [
      { id: 'r-lol-mod', name: 'Moderator', color: '#c8aa6e', hoist: true },
      { id: 'r-lol-challenger', name: 'Challenger', color: '#f1c40f', hoist: false },
    ],
    members: members(ALL_IDS.slice(0, 11), {
      'u-john': ['r-lol-mod'],
      'u-omar': ['r-lol-challenger'],
    }),
    voiceStates: { 'c-lol-aram': ['u-john'] },
  },
  {
    id: 's-roblox',
    name: 'Roblox',
    icon: '/servers/roblox.svg',
    bannerColor: '#e2231a',
    verified: true,
    ownerId: 'u-ava',
    categories: [
      { id: 'cat-rbx-info', name: 'Information' },
      { id: 'cat-rbx-chat', name: 'Community' },
      { id: 'cat-rbx-voice', name: 'Voice Channels' },
    ],
    channels: [
      ch('c-rbx-announcements', 'announcements', 'cat-rbx-info', 'announcement'),
      ch('c-rbx-general', 'general', 'cat-rbx-chat', 'text', 'Hang out and talk Roblox'),
      ch('c-rbx-games', 'game-recommendations', 'cat-rbx-chat', 'text', 'What are you playing?'),
      ch('c-rbx-studio', 'roblox-studio', 'cat-rbx-chat', 'text', 'Building and scripting help (Luau)'),
      ch('c-rbx-trading', 'trading', 'cat-rbx-chat'),
      ch('c-rbx-hangout', 'Hangout', 'cat-rbx-voice', 'voice'),
    ],
    roles: [
      { id: 'r-rbx-mod', name: 'Moderator', color: '#1b6fd8', hoist: true },
      { id: 'r-rbx-dev', name: 'Developer', color: '#f5c23e', hoist: true },
    ],
    members: members(ALL_IDS.slice(2, 14), {
      'u-ava': ['r-rbx-mod'],
      'u-mia': ['r-rbx-dev'],
      'u-noah': ['r-rbx-dev'],
    }),
    voiceStates: {},
  },
  {
    id: 's-halcyon',
    name: 'Project Halcyon',
    icon: '/servers/halcyon.svg',
    bannerColor: '#0f766e',
    ownerId: 'u-sarah',
    categories: [
      { id: 'cat-hal-project', name: 'Project' },
      { id: 'cat-hal-eng', name: 'Engineering' },
      { id: 'cat-hal-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-hal-announcements', 'announcements', 'cat-hal-project', 'announcement', 'Releases and team news'),
      ch('c-hal-general', 'general', 'cat-hal-project', 'text', 'Team chat'),
      ch('c-hal-roadmap', 'roadmap', 'cat-hal-project', 'text', 'What we’re building next'),
      ch('c-hal-frontend', 'frontend', 'cat-hal-eng', 'text', 'Next.js, React and the design system'),
      ch('c-hal-backend', 'backend', 'cat-hal-eng', 'text', 'APIs, queues and the database'),
      ch('c-hal-infra', 'infra', 'cat-hal-eng', 'text', 'Deploys, CI and on-call'),
      ch('c-hal-design', 'design', 'cat-hal-eng', 'text', 'Figma links and feedback'),
      ch('c-hal-standup', 'Daily Standup', 'cat-hal-voice', 'voice'),
      ch('c-hal-pairing', 'Pairing Room', 'cat-hal-voice', 'voice'),
    ],
    roles: [
      { id: 'r-hal-lead', name: 'Tech Lead', color: '#e67e22', hoist: true },
      { id: 'r-hal-eng', name: 'Engineer', color: '#2dd4bf', hoist: true },
      { id: 'r-hal-design', name: 'Design', color: '#f472b6', hoist: false },
    ],
    members: members([CURRENT_USER_ID, 'u-sarah', 'u-kai', 'u-omar', 'u-ava', 'u-nina', 'u-leo', 'u-zed', 'u-mod'], {
      'u-sarah': ['r-hal-lead'],
      [CURRENT_USER_ID]: ['r-hal-eng'],
      'u-omar': ['r-hal-eng'],
      'u-kai': ['r-hal-eng'],
      'u-nina': ['r-hal-design'],
    }),
    voiceStates: { 'c-hal-pairing': ['u-sarah'] },
  },
  {
    id: 's-ac',
    name: "Assassin's Creed",
    icon: '/servers/assassins-creed.svg',
    bannerColor: '#7f1d1d',
    verified: true,
    ownerId: 'u-leo',
    categories: [
      { id: 'cat-ac-info', name: 'The Bureau' },
      { id: 'cat-ac', name: 'Brotherhood' },
      { id: 'cat-ac-games', name: 'Games' },
      { id: 'cat-ac-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-ac-announcements', 'announcements', 'cat-ac-info', 'announcement', 'News from the Brotherhood'),
      ch('c-ac-general', 'general', 'cat-ac', 'text', 'Nothing is true, everything is permitted'),
      ch('c-ac-lore', 'lore-discussion', 'cat-ac', 'text', 'Isu, Templars and the modern day story'),
      ch('c-ac-screenshots', 'screenshots', 'cat-ac', 'text', 'Photo mode masterpieces'),
      ch('c-ac-shadows', 'shadows', 'cat-ac-games', 'text', 'Feudal Japan: Naoe & Yasuke'),
      ch('c-ac-mirage', 'mirage', 'cat-ac-games', 'text', 'Basim in Baghdad'),
      ch('c-ac-valhalla', 'valhalla', 'cat-ac-games', 'text', 'Raids, settlements and Eivor'),
      ch('c-ac-classics', 'classics', 'cat-ac-games', 'text', 'Ezio, Altaïr, Edward and friends'),
      ch('c-ac-hideout', 'Hideout', 'cat-ac-voice', 'voice'),
    ],
    roles: [
      { id: 'r-ac-mentor', name: 'Mentor', color: '#b91c1c', hoist: true },
      { id: 'r-ac-master', name: 'Master Assassin', color: '#d9d4c7', hoist: true },
      { id: 'r-ac-novice', name: 'Novice', color: '#94a3b8', hoist: false },
    ],
    members: members([CURRENT_USER_ID, 'u-leo', 'u-mia', 'u-luke', 'u-john', 'u-ironman', 'u-kai', 'u-ella', 'u-noah', 'u-mod'], {
      'u-leo': ['r-ac-mentor'],
      'u-mia': ['r-ac-master'],
      'u-ironman': ['r-ac-master'],
      [CURRENT_USER_ID]: ['r-ac-novice'],
    }),
    voiceStates: { 'c-ac-hideout': ['u-mia', 'u-ella'] },
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
    ['u-ironman', 'Does anyone remember if they are postponing the Legendary Rookie Revelation drop, or did they scrap it all together?', 95, { threadId: 't-rookie-drop' }],
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
  't-rookie-drop': [
    ['u-mustapha', 'Starting a thread so this doesn’t get buried 🧵', 94],
    ['u-luke', 'Officially postponed, not cancelled. New date should drop with next week’s announcement.', 90],
    ['u-ironman', 'Perfect, thanks Luke 🙏', 88],
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
  'c-mc-general': [
    ['u-omar', 'Finally finished my mountain castle in survival, only took 3 weeks 😅', 200],
    ['u-ava', 'screenshots or it didn’t happen', 198],
    ['u-omar', 'posting in #build-showcase in a sec', 197],
    ['u-kai', 'Reminder: the SMP resets biomes in the nether this weekend. Grab your stuff!', 150, { pinned: true }],
    ['u-leo', 'does anyone have a good iron farm design for 1.21? mine keeps breaking', 60],
    ['u-nina', 'check #redstone, there’s a pinned one that does ~1400/hr', 57],
    ['u-leo', 'legend, ty', 55, { reactions: [{ emoji: '⛏️', userIds: ['u-nina'] }] }],
    ['u-ava', 'who’s hopping on the Survival SMP voice tonight?', 10],
  ],
  'c-mc-builds': [
    ['u-omar', 'Mountain castle, fully survival. Took way too much deepslate.', 196, { reactions: [{ emoji: '🔥', userIds: ['u-ava', 'u-kai', 'u-nina', CURRENT_USER_ID] }, { emoji: '😍', userIds: ['u-leo'] }] }],
    ['u-ava', 'the waterfall into the courtyard 😭 so good', 190],
  ],
  'c-mc-redstone': [
    ['u-nina', '**Iron farm (1.21)** — 20 villagers, 3 zombies, ~1400 iron/hr. Layout screenshots are pinned in this channel.', 3 * 24 * 60, { pinned: true }],
    ['u-leo', 'is it zombie-proof on hard mode?', 3 * 24 * 60 - 30],
    ['u-nina', 'yep, as long as you light up the area around it', 3 * 24 * 60 - 25],
  ],
  'c-mc-announcements': [
    ['u-kai', '## New snapshot is out 🎉\nNew mob, bundle tweaks and a bunch of bug fixes. Backup your worlds before trying it!', 26 * 60, { reactions: [{ emoji: '🎉', userIds: ['u-omar', 'u-ava', 'u-nina'] }] }],
  ],
  'c-val-general': [
    ['u-zed', 'new map in the pool, thoughts?', 180],
    ['u-ironman', 'attacker sided for sure. B site is a nightmare to retake', 176],
    ['u-kai', 'Nah it’s fine once you learn the lineups, check #agents-and-strats', 170],
    ['u-ironman', 'just hit Radiant btw 😎', 45, { reactions: [{ emoji: '🎉', userIds: ['u-zed', 'u-kai', 'u-sarah'] }, { emoji: '👑', userIds: ['u-omar'] }] }],
    ['u-zed', 'GGs, carried by your Jett as usual', 42],
    ['u-zed', '', 35, {
      poll: {
        question: 'Which map should rotate out of the competitive pool next?',
        multiple: false,
        endsAt: 20 * 60, // minutes from now, resolved in createSeedMessages
        options: [
          { id: 'breeze', text: 'Breeze', voterIds: ['u-ironman', 'u-kai', 'u-omar'] },
          { id: 'fracture', text: 'Fracture', voterIds: ['u-sarah', 'u-ava'] },
          { id: 'pearl', text: 'Pearl', voterIds: ['u-luke'] },
          { id: 'sunset', text: 'Sunset', voterIds: [] },
        ],
      },
    }],
  ],
  'c-val-lfg': [
    ['u-kai', 'Immortal 1, NA, can flex controller/initiator. Need 2 for ranked tonight', 90],
    ['u-omar', 'Ascendant 3 sentinel main, I’m in', 85],
  ],
  'c-val-patch': [
    ['u-zed', '**Patch notes are live**\n- Agent balance changes\n- Map pool rotation\n- Ranked RR adjustments for placement games', 2 * 24 * 60],
  ],
  'c-fn-general': [
    ['u-sarah', 'the new season map is so good, the city POI is chaos', 140],
    ['u-john', 'landing there every game and dying every game 💀', 135, { reactions: [{ emoji: '💀', userIds: ['u-sarah', 'u-luke'] }] }],
    ['u-john', 'this trick shot compilation is actually insane https://www.youtube.com/watch?v=dQw4w9WgXcQ', 90],
    ['u-sarah', 'john. JOHN. I can’t believe I fell for that in 2026 😭', 88, { reactions: [{ emoji: '😂', userIds: ['u-luke', 'u-john', 'u-kai'] }] }],
    ['u-luke', 'build or zero build tonight?', 60],
    ['u-sarah', 'zero build, my building skills are gone', 58],
  ],
  'c-fn-shop': [
    ['u-john', 'today’s shop is actually fire, that new emote 🔥', 300],
    ['u-sarah', 'saving my V-Bucks for the battle pass tbh', 290],
  ],
  'c-fn-creative': [
    ['u-luke', 'made a 1v1 build fight map, code in my bio. Feedback welcome!', 24 * 60],
  ],
  'c-lol-general': [
    ['u-john', 'gg that was the most chaotic ARAM ever', 120],
    ['u-omar', 'five tanks vs five assassins, never again 😂', 118, { reactions: [{ emoji: '😂', userIds: ['u-john', 'u-kai'] }] }],
    ['u-kai', 'anyone watching the finals this weekend?', 50],
    ['u-john', 'obviously, watch party in #esports', 48],
  ],
  'c-lol-champs': [
    ['u-omar', 'Is lethality still the best build on this champ or did the patch kill it?', 3 * 60],
    ['u-kai', 'Still good but crit feels better into tanky comps', 170],
  ],
  'c-rbx-general': [
    ['u-mia', 'just published my first obby, go easy on me', 240, { reactions: [{ emoji: '❤️', userIds: ['u-ava', 'u-noah'] }] }],
    ['u-ava', 'played it, the lava section is evil 😭', 230],
    ['u-noah', 'anyone know a good tutorial for DataStores? my saves keep failing', 70],
    ['u-mia', '#roblox-studio has a pinned guide, check the part about UpdateAsync', 66],
  ],
  'c-rbx-studio': [
    ['u-mia', '**DataStore tips**\n- Use `UpdateAsync` instead of `SetAsync`\n- Wrap calls in `pcall`\n- Save on `PlayerRemoving` *and* `BindToClose`', 2 * 24 * 60, { pinned: true }],
  ],
  'c-hal-general': [
    ['u-sarah', 'Morning team ☀️ standup in 10 in the Pairing Room', 26 * 60],
    ['u-kai', 'on my way', 26 * 60 - 3],
    ['u-omar', 'Heads up: Next.js 16 is out and Turbopack is now the default for `next dev` and `next build` 🚀', 24 * 60, { reactions: [{ emoji: '🚀', userIds: ['u-kai', 'u-sarah', CURRENT_USER_ID] }] }],
    ['u-ava', 'and `params` is async-only now, so:\n```tsx\nexport default async function Page({ params }) {\n  const { slug } = await params\n  return <h1>{slug}</h1>\n}\n```', 23 * 60],
    ['u-nina', 'Has anyone tried the React Compiler with it yet?', 45],
    ['u-kai', 'Yeah, works great. Just set `reactCompiler: true` in next.config.ts', 40],
    ['u-sarah', '@boushib nice work on the Discord clone migration! 🙌 Mind sharing how you handled the Pages → App Router move?', 8],
  ],
  'c-hal-roadmap': [
    ['u-sarah', '## Q4 roadmap\n- **Realtime sync** for the editor\n- **SSO** for enterprise customers\n- Public API v2 (beta)\n- Mobile app polish', 5 * 24 * 60, { pinned: true, reactions: [{ emoji: '👀', userIds: ['u-kai', 'u-omar'] }] }],
  ],
  'c-hal-frontend': [
    ['u-omar', 'Heads up if you’re upgrading: `next lint` is gone, switch to the ESLint CLI with a flat config', 25 * 60],
    ['u-leo', 'Getting `Error: Cannot call impure function during render` from the linter, what does that mean?', 5 * 60],
    ['u-omar', 'You’re probably calling `Math.random()` or `Date.now()` in a component body. Move it into an effect or event handler — otherwise server and client renders won’t match.', 5 * 60 - 12, { reactions: [{ emoji: '🙏', userIds: ['u-leo'] }] }],
  ],
  'c-hal-backend': [
    ['u-kai', 'Queue workers are back to normal after the retry storm. Added exponential backoff + jitter.', 6 * 60],
    ['u-zed', 'nice. can we add an alert on dead-letter queue size too?', 5 * 60],
  ],
  'c-hal-infra': [
    ['u-mod', '✅ Deploy `v2.14.0` to production succeeded (4m 12s)', 90],
    ['u-mod', '✅ All health checks passing', 89],
  ],
  'c-ac-general': [
    ['u-leo', 'Just finished Shadows. Naoe’s stealth kit is the best since Unity imo', 300],
    ['u-mia', 'agreed, the grappling hook changes everything', 295],
    ['u-ironman', 'Yasuke just walking through the front gate is also a vibe 😂', 290, { reactions: [{ emoji: '😂', userIds: ['u-leo', 'u-mia', 'u-kai'] }] }],
    ['u-kai', 'Hot take: Black Flag is still the best one', 120],
    ['u-luke', 'not a hot take, that’s just a fact 🏴‍☠️', 118, { reactions: [{ emoji: '🏴‍☠️', userIds: ['u-kai', 'u-john'] }] }],
    ['u-ella', 'anyone doing a leap of faith photo contest this month?', 30],
    ['u-mia', 'yes! post entries in #screenshots, voting on Sunday', 28],
  ],
  'c-ac-announcements': [
    ['u-leo', '## Photo mode contest 📸\nTheme: **Leap of Faith**. Post your best shot in #screenshots before Sunday. Winner gets the Master Assassin role!', 2 * 24 * 60, { pinned: true, reactions: [{ emoji: '🦅', userIds: ['u-mia', 'u-ella', 'u-kai', 'u-ironman'] }] }],
  ],
  'c-ac-lore': [
    ['u-mia', 'Can we talk about how the modern-day story basically disappeared after Valhalla?', 3 * 24 * 60],
    ['u-leo', 'The Animus Hub is supposed to tie it together. We’ll see…', 3 * 24 * 60 - 20],
    ['u-noah', 'I just want more Isu stuff honestly, Those Who Came Before are the most interesting part', 2 * 24 * 60],
    ['u-mia', '> Those Who Came Before are the most interesting part\nthis. Juno arc deserved a real ending', 2 * 24 * 60 - 10],
  ],
  'c-ac-screenshots': [
    ['u-ella', 'Leap of faith off the Kyoto pagoda at sunset 🌅 (contest entry)', 20 * 60, { reactions: [{ emoji: '😍', userIds: ['u-mia', 'u-leo'] }, { emoji: '🦅', userIds: ['u-kai'] }] }],
    ['u-kai', 'Florence rooftops, still gorgeous after all these years', 10 * 60],
  ],
  'c-ac-shadows': [
    ['u-ironman', 'Best skill tree for Naoe early game? I keep getting spotted', 8 * 60],
    ['u-leo', 'Rush the shadow blend + tanto assassination upgrades, then kunai. Night missions are way easier too.', 8 * 60 - 15],
  ],
  'c-ac-classics': [
    ['u-luke', '“Requiescat in pace.” Still gives me chills 🥲', 4 * 24 * 60, { reactions: [{ emoji: '🥲', userIds: ['u-kai', 'u-leo', 'u-mia'] }] }],
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
        // Seed polls store their duration in minutes; turn it into a timestamp
        ...(extra?.poll && { poll: { ...extra.poll, endsAt: now + extra.poll.endsAt * MINUTE } }),
      })),
    ])
  )

export const SEED_THREADS = (now: number): Thread[] => [
  {
    id: 't-rookie-drop',
    name: 'Legendary Rookie Revelation drop',
    serverId: 's-dapper',
    parentChannelId: 'c-dapper-general',
    parentMessageId: 'm-c-dapper-general-3',
    ownerId: 'u-mustapha',
    createdAt: now - 94 * MINUTE,
  },
]

/** Channels that start with unread messages */
export const SEED_UNREAD = ['c-val-general', 'c-dapper-announcements', 'dm-sarah', 'c-ac-general', 'c-hal-general']
