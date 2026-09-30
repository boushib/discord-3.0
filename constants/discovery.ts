import type { Server } from '../models'
import { SEED_USERS } from './seed'

export type DiscoveryCategory = 'gaming' | 'music' | 'education' | 'tech' | 'entertainment'

export interface DiscoverableServer {
  server: Server
  description: string
  category: DiscoveryCategory
  members: number
  online: number
}

export const DISCOVERY_CATEGORIES: { id: DiscoveryCategory | 'home'; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🧭' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'tech', label: 'Science & Tech', icon: '🧪' },
  { id: 'entertainment', label: 'Entertainment', icon: '📺' },
]

const others = SEED_USERS.filter(u => u.id !== 'u-me').map(u => u.id)

const make = (
  id: string,
  name: string,
  bannerColor: string,
  channels: string[],
  topic: string
): Server => ({
  id,
  name,
  bannerColor,
  ownerId: others[id.length % others.length],
  categories: [
    { id: `${id}-cat-text`, name: 'Text Channels' },
    { id: `${id}-cat-voice`, name: 'Voice Channels' },
  ],
  channels: [
    { id: `${id}-welcome`, name: 'welcome', type: 'announcement', categoryId: `${id}-cat-text`, topic },
    ...channels.map(c => ({ id: `${id}-${c}`, name: c, type: 'text' as const, categoryId: `${id}-cat-text` })),
    { id: `${id}-voice`, name: 'Lounge', type: 'voice', categoryId: `${id}-cat-voice` },
  ],
  roles: [{ id: `${id}-mod`, name: 'Moderator', color: '#3ba55c', hoist: true }],
  members: others.slice(0, 6 + (id.length % 6)).map((userId, i) => ({
    userId,
    roleIds: i === 0 ? [`${id}-mod`] : [],
    joinedAt: Date.UTC(2022, i, 1),
  })),
  voiceStates: {},
})

export const DISCOVERABLE: DiscoverableServer[] = [
  {
    server: make('d-lofi', 'Lofi Study Hall', '#6d28d9', ['general', 'study-together', 'playlists'], 'Chill beats to study to'),
    description: 'Study with thousands of people around the world. Focus rooms, playlists and good vibes.',
    category: 'music',
    members: 482113,
    online: 71240,
  },
  {
    server: make('d-indiedev', 'Indie Game Devs', '#059669', ['general', 'showcase', 'godot', 'unity', 'feedback'], 'Make games, share progress'),
    description: 'A friendly community for indie game developers. Share your devlogs and get feedback.',
    category: 'gaming',
    members: 128904,
    online: 14322,
  },
  {
    server: make('d-apex', 'Apex Legends Squad', '#b91c1c', ['general', 'lfg', 'legends', 'clips'], 'Find your trio'),
    description: 'Trios, ranked grind and legend tier lists. Find a squad any time of day.',
    category: 'gaming',
    members: 231556,
    online: 18830,
  },
  {
    server: make('d-astro', 'Space & Astronomy', '#1e3a8a', ['general', 'astrophotography', 'launches'], 'Look up!'),
    description: 'Rocket launches, telescope setups and the latest from JWST.',
    category: 'education',
    members: 89231,
    online: 7610,
  },
  {
    server: make('d-anime', 'Anime Watch Party', '#db2777', ['general', 'seasonal', 'recommendations'], 'Weekly watch parties'),
    description: 'Seasonal discussion threads, weekly watch parties and recommendation swaps.',
    category: 'entertainment',
    members: 301442,
    online: 40211,
  },
  {
    server: make('d-speedrun', 'Speedrunning Hub', '#ea580c', ['general', 'routes', 'wr-watch'], 'Gotta go fast'),
    description: 'Routes, tricks and world-record watch alongs for every game you can think of.',
    category: 'gaming',
    members: 74120,
    online: 9120,
  },
  {
    server: make('d-langs', 'Language Exchange', '#16a34a', ['general', 'spanish', 'japanese', 'french'], 'Practice with natives'),
    description: 'Find a language partner and practice speaking in our voice rooms.',
    category: 'education',
    members: 156783,
    online: 21004,
  },
  {
    server: make('d-synth', 'Synth & Production', '#9333ea', ['general', 'feedback', 'gear'], 'Make some noise'),
    description: 'Producers, beat makers and synth nerds sharing tracks and patches.',
    category: 'music',
    members: 45810,
    online: 5220,
  },
]
