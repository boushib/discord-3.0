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

export const BF6_ICON =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqGZrG0VENzVoH8EUkJ1B5A6EX2Kub6rUk1VT9pL8Haw&s=10'

export const AC_SHADOWS_ICON =
  'https://image.api.playstation.com/vulcan/ap/rnd/202404/1815/33f39cad34ac468a040ffed5a43149fb4329ec6c73326838.jpg'

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
    icon: '/servers/valorant.jpg',
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
    icon: '/servers/fortnite.jpg',
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
    icon: '/servers/league.jpg',
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
    id: 's-wukong',
    name: 'Black Myth: Wukong',
    icon: '/servers/wukong.jpg',
    bannerColor: '#c8902c',
    verified: true,
    ownerId: 'u-omar',
    categories: [
      { id: 'cat-bmw-info', name: 'Temple' },
      { id: 'cat-bmw-chat', name: 'Journey to the West' },
      { id: 'cat-bmw-play', name: 'Gameplay' },
      { id: 'cat-bmw-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-bmw-announcements', 'announcements', 'cat-bmw-info', 'announcement', 'Updates and events'),
      ch('c-bmw-general', 'general', 'cat-bmw-chat', 'text', 'The Destined One’s hangout 🐒'),
      ch('c-bmw-lore', 'lore-and-myths', 'cat-bmw-chat', 'text', 'Journey to the West, yaoguai and secrets'),
      ch('c-bmw-photo', 'photo-mode', 'cat-bmw-chat', 'text', 'Share your screenshots'),
      ch('c-bmw-bosses', 'boss-help', 'cat-bmw-play', 'text', 'Stuck on a boss? Ask here (spoiler-tag names!)'),
      ch('c-bmw-builds', 'builds-and-stances', 'cat-bmw-play', 'text', 'Smash, Pillar and Thrust stance builds'),
      ch('c-bmw-spells', 'spells-and-transformations', 'cat-bmw-play', 'text', 'Immobilize, Cloud Step, Spirits and more'),
      ch('c-bmw-secrets', 'secret-areas', 'cat-bmw-play'),
      ch('c-bmw-voice', 'Keeper’s Shrine', 'cat-bmw-voice', 'voice'),
    ],
    roles: [
      { id: 'r-bmw-sage', name: 'Great Sage', color: '#e5b454', hoist: true },
      { id: 'r-bmw-destined', name: 'Destined One', color: '#c0392b', hoist: true },
      { id: 'r-bmw-monkey', name: 'Little Monkey', color: '#a0845c', hoist: false },
    ],
    members: members(ALL_IDS.slice(2, 14), {
      'u-omar': ['r-bmw-sage'],
      'u-nina': ['r-bmw-destined'],
      'u-zed': ['r-bmw-destined'],
      'u-noah': ['r-bmw-monkey'],
    }),
    voiceStates: { 'c-bmw-voice': ['u-zed'] },
  },
  {
    id: 's-halcyon',
    name: 'Project Halcyon',
    icon: '/servers/stealth.svg',
    bannerColor: '#2b2b2b',
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
    id: 's-acshadows',
    name: "Assassin's Creed Shadows",
    icon: AC_SHADOWS_ICON,
    iconPosition: '50% 72%',
    bannerColor: '#8b0f1f',
    verified: true,
    ownerId: 'u-leo',
    categories: [
      { id: 'cat-acs-info', name: 'The Brotherhood' },
      { id: 'cat-acs-chat', name: 'Feudal Japan' },
      { id: 'cat-acs-play', name: 'Gameplay' },
      { id: 'cat-acs-voice', name: 'Voice' },
    ],
    channels: [
      ch('c-acs-announcements', 'announcements', 'cat-acs-info', 'announcement', 'Patch notes, DLC and events'),
      ch('c-acs-rules', 'rules', 'cat-acs-info'),
      ch('c-acs-general', 'general', 'cat-acs-chat', 'text', 'Nothing is true, everything is permitted ⛩️'),
      ch('c-acs-naoe', 'naoe-shinobi', 'cat-acs-chat', 'text', 'Stealth builds, kusarigama and kunai'),
      ch('c-acs-yasuke', 'yasuke-samurai', 'cat-acs-chat', 'text', 'Kanabo, teppo and parry timing'),
      ch('c-acs-lore', 'lore-and-history', 'cat-acs-chat', 'text', 'Sengoku period, the Shinbakufu and the Animus'),
      ch('c-acs-photo', 'photo-mode', 'cat-acs-play', 'text', 'Seasons, sakura and sunsets'),
      ch('c-acs-hideout', 'hideout-builds', 'cat-acs-play', 'text', 'Show off your hideout layouts'),
      ch('c-acs-help', 'help-and-tips', 'cat-acs-play'),
      ch('c-acs-voice', 'Hideout', 'cat-acs-voice', 'voice'),
      ch('c-acs-coop', 'Photo Mode Session', 'cat-acs-voice', 'voice'),
    ],
    roles: [
      { id: 'r-acs-mentor', name: 'Mentor', color: '#c8102e', hoist: true },
      { id: 'r-acs-shinobi', name: 'Shinobi', color: '#9b8ec4', hoist: true },
      { id: 'r-acs-samurai', name: 'Samurai', color: '#d4a54a', hoist: true },
      { id: 'r-acs-novice', name: 'Novice', color: '#94a3b8', hoist: false },
    ],
    members: members(
      [CURRENT_USER_ID, 'u-leo', 'u-mia', 'u-luke', 'u-john', 'u-ironman', 'u-kai', 'u-ella', 'u-noah', 'u-sarah', 'u-mod'],
      {
        'u-leo': ['r-acs-mentor'],
        'u-mia': ['r-acs-shinobi'],
        'u-ella': ['r-acs-shinobi'],
        'u-ironman': ['r-acs-samurai'],
        'u-kai': ['r-acs-samurai'],
        'u-mod': ['r-acs-mentor'],
        [CURRENT_USER_ID]: ['r-acs-novice'],
      }
    ),
    voiceStates: { 'c-acs-voice': ['u-mia', 'u-ella'] },
  },
  {
    id: 's-bf6',
    name: 'Battlefield 6',
    icon: BF6_ICON,
    bannerColor: '#ff6a13',
    verified: true,
    ownerId: 'u-john',
    categories: [
      { id: 'cat-bf-info', name: 'HQ' },
      { id: 'cat-bf-chat', name: 'Battlefield' },
      { id: 'cat-bf-voice', name: 'Squads' },
    ],
    channels: [
      ch('c-bf-announcements', 'announcements', 'cat-bf-info', 'announcement', 'Updates, seasons and events'),
      ch('c-bf-general', 'general', 'cat-bf-chat', 'text', 'All things Battlefield 6'),
      ch('c-bf-lfs', 'looking-for-squad', 'cat-bf-chat', 'text', 'Platform, region, class and playstyle'),
      ch('c-bf-classes', 'classes-and-loadouts', 'cat-bf-chat', 'text', 'Assault, Engineer, Support and Recon'),
      ch('c-bf-vehicles', 'vehicles', 'cat-bf-chat', 'text', 'Tanks, jets and helicopters'),
      ch('c-bf-clips', 'clips', 'cat-bf-chat', 'text', 'Only in Battlefield moments'),
      ch('c-bf-portal', 'portal-experiences', 'cat-bf-chat', 'text', 'Share your Portal codes'),
      ch('c-bf-alpha', 'Alpha Squad', 'cat-bf-voice', 'voice'),
      ch('c-bf-bravo', 'Bravo Squad', 'cat-bf-voice', 'voice'),
      ch('c-bf-conquest', 'Conquest 64p', 'cat-bf-voice', 'voice'),
    ],
    roles: [
      { id: 'r-bf-command', name: 'Commander', color: '#ff6a13', hoist: true },
      { id: 'r-bf-pilot', name: 'Pilot', color: '#5dade2', hoist: true },
      { id: 'r-bf-medic', name: 'Medic', color: '#58d68d', hoist: false },
    ],
    members: members(ALL_IDS, {
      'u-john': ['r-bf-command'],
      'u-mustapha': ['r-bf-command'],
      'u-omar': ['r-bf-pilot'],
      'u-zed': ['r-bf-pilot'],
      'u-sarah': ['r-bf-medic'],
      [CURRENT_USER_ID]: ['r-bf-medic'],
    }),
    voiceStates: { 'c-bf-alpha': ['u-john', 'u-omar', 'u-zed'], 'c-bf-conquest': ['u-mustapha'] },
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
  'c-bmw-general': [
    ['u-omar', 'Just beat the final chapter. The art direction in this game is unreal', 240, { reactions: [{ emoji: '🐒', userIds: ['u-nina', 'u-zed', 'u-noah'] }] }],
    ['u-nina', 'The temples in chapter 3 in the snow… I spent an hour in photo mode', 230],
    ['u-zed', 'Still stuck on ||Yellowwind Sage|| ngl 😭', 70],
    ['u-omar', 'Immobilize + heavy attacks, and save a gourd charge for his wind phase. Check #boss-help', 66, { reactions: [{ emoji: '🙏', userIds: ['u-zed'] }] }],
    ['u-noah', 'Is NG+ worth it or should I just go 100% the first playthrough?', 20],
  ],
  'c-bmw-announcements': [
    ['u-omar', '## Screenshot contest 📸\nTheme: **Mountains & Mist**. Post in #photo-mode before Sunday — winner gets the Great Sage role!', 2 * 24 * 60, { pinned: true, reactions: [{ emoji: '⛰️', userIds: ['u-nina', 'u-zed', 'u-noah'] }] }],
  ],
  'c-bmw-bosses': [
    ['u-nina', '**General tips**\n- Dodge *through* attacks, perfect dodges build focus\n- Immobilize is your best friend on fast bosses\n- Upgrade your gourd before farming Will\n- Spirit transformations give you a free health bar', 3 * 24 * 60, { pinned: true }],
    ['u-zed', 'Any tips for the Tiger Vanguard? he keeps one-shotting me', 5 * 60],
    ['u-omar', 'Fight him with Pillar stance and stay on top of the staff during his combos', 5 * 60 - 10],
  ],
  'c-bmw-builds': [
    ['u-omar', 'Smash stance + Rock Solid is the most fun build imo. Perfect counters feel amazing', 26 * 60, { reactions: [{ emoji: '🔥', userIds: ['u-nina'] }] }],
    ['u-noah', 'Pillar stance for the win, pogo-ing over everything is too good', 24 * 60],
  ],
  'c-bmw-lore': [
    ['u-nina', 'Love how every boss is a yaoguai from Journey to the West. The journal entries after each fight are gold', 3 * 24 * 60],
    ['u-noah', 'The animated chapter endings are some of the best storytelling in any game this decade', 3 * 24 * 60 - 20],
  ],
  'c-bmw-photo': [
    ['u-nina', 'Destined One overlooking the valley at dawn 🌄 (contest entry)', 18 * 60, { reactions: [{ emoji: '😍', userIds: ['u-omar', 'u-zed'] }] }],
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
  'c-acs-general': [
    ['u-leo', 'Just rolled credits on Shadows. The dual-protagonist thing works way better than I expected', 300],
    ['u-mia', 'Naoe’s grappling hook + hiding in shadows is the best stealth since Unity imo', 295],
    ['u-ironman', 'Meanwhile Yasuke just walking through the front gate of every castle 😂', 290, { reactions: [{ emoji: '😂', userIds: ['u-leo', 'u-mia', 'u-kai'] }] }],
    ['u-kai', 'The seasons system is so underrated. Winter infiltrations hit different ❄️', 200],
    ['u-ella', 'Is the Claws of Awaji expansion worth it?', 120, { threadId: 't-awaji' }],
    ['u-luke', 'Photo mode contest starts this weekend, check #announcements 📸', 30],
    ['u-mia', 'Who’s hopping in the Hideout voice tonight?', 8],
  ],
  't-awaji': [
    ['u-leo', 'Starting a thread so this doesn’t get buried 🧵', 118],
    ['u-mia', 'Yes! New island, new gear and a boss fight that actually tests your parries.', 114],
    ['u-kai', 'Took me ~12 hours with side content. Great value if you liked the base game.', 110],
    ['u-ella', 'Sold, grabbing it tonight 🙏', 105],
  ],
  'c-acs-announcements': [
    ['u-leo', '## Photo Mode Contest 📸\nTheme: **Cherry Blossom Season**. Post your best shot in #photo-mode before Sunday. Winner gets the Shinobi role!', 2 * 24 * 60, { pinned: true, reactions: [{ emoji: '🌸', userIds: ['u-mia', 'u-ella', 'u-kai', 'u-ironman'] }] }],
    ['u-mod', '**Title update is live**\n- New Assassination and Stealth difficulty options\n- Hideout layout slots increased\n- Fixes for rooftop traversal and ally AI', 20 * 60],
  ],
  'c-acs-rules': [
    ['u-mod', '**1.** Be respectful.\n**2.** Spoiler-tag story details with ||spoilers||.\n**3.** Keep builds in #naoe-shinobi and #yasuke-samurai.\n**4.** No piracy talk.', 30 * 24 * 60, { pinned: true }],
  ],
  'c-acs-naoe': [
    ['u-mia', '**Early-game Naoe build**\n- Shadow Blend + Silent Assassination first\n- Kusarigama for crowd control\n- Kunai for quiet takedowns from range\nNight missions are way easier.', 3 * 24 * 60, { pinned: true, reactions: [{ emoji: '🥷', userIds: ['u-ella', 'u-kai', CURRENT_USER_ID] }] }],
    ['u-ironman', 'Best skill tree for Naoe early game? I keep getting spotted', 8 * 60],
    ['u-mia', 'Crouch in tall grass and use the eagle… I mean the observe mode more. Also prone under buildings!', 8 * 60 - 15],
  ],
  'c-acs-yasuke': [
    ['u-kai', 'Kanabo + perfect parries = nothing survives', 6 * 60, { reactions: [{ emoji: '💪', userIds: ['u-ironman', 'u-luke'] }] }],
    ['u-ironman', 'Teppo headshots from across the courtyard are so satisfying', 5 * 60],
  ],
  'c-acs-lore': [
    ['u-noah', 'Love that it’s set during Oda Nobunaga’s campaign in the Sengoku period', 3 * 24 * 60],
    ['u-mia', '||The Shinbakufu masks reveal was such a good twist||', 3 * 24 * 60 - 20],
    ['u-leo', 'And the Animus Hub framing ties it all back to the modern-day story', 2 * 24 * 60],
  ],
  'c-acs-photo': [
    ['u-ella', 'Naoe on a pagoda roof at sunset 🌅 (contest entry)', 20 * 60, { reactions: [{ emoji: '😍', userIds: ['u-mia', 'u-leo'] }, { emoji: '🌸', userIds: ['u-kai'] }] }],
    ['u-kai', 'Winter in the mountains near Kyoto, the snow effects are unreal', 10 * 60],
  ],
  'c-acs-hideout': [
    ['u-luke', 'Went full zen garden with the hideout, koi pond + dojo in the middle', 26 * 60, { reactions: [{ emoji: '🎋', userIds: ['u-mia', 'u-ella'] }] }],
  ],
  'c-bf-general': [
    ['u-john', 'Conquest on the new city map is absolute chaos (complimentary)', 180],
    ['u-omar', 'Watching a whole building collapse on a squad camping the objective never gets old', 175, { reactions: [{ emoji: '💥', userIds: ['u-john', 'u-zed', 'u-sarah'] }] }],
    ['u-sarah', 'Please revive me before you run off to cap the flag 😭', 120],
    ['u-zed', 'jets feel great this time, finally some proper dogfights', 60],
    ['u-mustapha', 'Squad up in Alpha, we need an engineer for the tank', 12],
  ],
  'c-bf-announcements': [
    ['u-john', '## Season 1 is live 🎖️\nNew maps, weapons and a Battle Pass. Double XP weekend starts Friday!', 2 * 24 * 60, { pinned: true, reactions: [{ emoji: '🔥', userIds: ['u-omar', 'u-zed', 'u-sarah', 'u-mustapha'] }] }],
  ],
  'c-bf-lfs': [
    ['u-omar', 'PC, EU, pilot main, need 3 for Breakthrough tonight', 90],
    ['u-kai', 'I can play recon, add me', 85],
  ],
  'c-bf-classes': [
    ['u-sarah', 'Support with the defib + ammo crate is the most underrated class. Revive everyone 🩹', 5 * 60, { reactions: [{ emoji: '🩹', userIds: ['u-john', 'u-omar'] }] }],
    ['u-zed', 'Recon with the spawn beacon on a rooftop wins more games than any sniper shot', 4 * 60],
  ],
  'c-bf-clips': [
    ['u-omar', 'C4 on a quad bike into a tank. Only in Battlefield 😂', 20 * 60, { reactions: [{ emoji: '😂', userIds: ['u-john', 'u-zed', 'u-kai'] }] }],
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
    id: 't-awaji',
    name: 'Is the Claws of Awaji expansion worth it?',
    serverId: 's-acshadows',
    parentChannelId: 'c-acs-general',
    parentMessageId: 'm-c-acs-general-4',
    ownerId: 'u-leo',
    createdAt: now - 118 * MINUTE,
  },
]

/** Channels that start with unread messages */
export const SEED_UNREAD = ['c-val-general', 'c-acs-announcements', 'dm-sarah', 'c-bf-general', 'c-hal-general']
