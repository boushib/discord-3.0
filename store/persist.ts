import type { RootState } from '.'
import { createSeedMessages, SEED_SERVERS, SEED_THREADS } from '../constants/seed'
import { initialPrefs, SEED_VERSION } from './prefs'

const STORAGE_KEY = 'discord-clone:v1'

type PersistedState = Omit<RootState, 'ui'>

// Demo servers and channels retired in each seed version
const RETIRED: Record<number, { servers: string[]; channelPrefixes: string[] }> = {
  2: {
    servers: ['s-topshot', 's-nflallday', 's-nextjs', 's-eternal', 's-ac'],
    channelPrefixes: ['c-ts-', 'c-nfl-', 'c-next-', 'c-et-', 'c-ac-'],
  },
  3: {
    servers: ['s-dapper', 's-rl', 's-ac'],
    channelPrefixes: ['c-dapper-', 'c-rl-', 'c-ac-', 't-rookie-drop'],
  },
}

/**
 * Swap retired demo servers for the current seed ones while keeping
 * everything the user made: their own servers, DMs, messages and settings.
 */
const migrateSeed = (state: PersistedState, fromVersion: number): PersistedState => {
  const steps = Object.entries(RETIRED).filter(([v]) => Number(v) > fromVersion).map(([, r]) => r)
  const retiredServers = new Set(steps.flatMap(r => r.servers))
  const prefixes = steps.flatMap(r => r.channelPrefixes)

  const byId = { ...state.servers.byId }
  retiredServers.forEach(id => delete byId[id])
  for (const server of SEED_SERVERS) byId[server.id] ??= server
  const seedOrder = SEED_SERVERS.map(s => s.id)
  const userOrder = state.servers.order.filter(id => byId[id] && !seedOrder.includes(id))

  // Folders and threads can't point at servers that no longer exist
  const folders = Object.fromEntries(
    Object.entries(state.servers.folders ?? {})
      .map(([id, f]) => [id, { ...f, serverIds: f.serverIds.filter(s => byId[s]) }] as const)
      .filter(([, f]) => f.serverIds.length > 1)
  )
  const threads = Object.fromEntries(
    Object.entries(state.threads ?? {}).filter(([, t]) => !retiredServers.has(t.serverId))
  )

  const messages = Object.fromEntries(
    Object.entries(state.messages).filter(([id]) => !prefixes.some(p => id.startsWith(p)))
  )
  for (const [id, list] of Object.entries(createSeedMessages(Date.now()))) messages[id] ??= list
  for (const thread of SEED_THREADS(Date.now())) threads[thread.id] ??= thread

  return {
    ...state,
    servers: { byId, order: [...seedOrder, ...userOrder], folders },
    threads,
    messages,
    prefs: { ...state.prefs, seedVersion: SEED_VERSION },
  }
}

export const loadState = (): Partial<PersistedState> | undefined => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    let state = JSON.parse(raw) as PersistedState
    const version = state.prefs?.seedVersion ?? 1
    if (version < SEED_VERSION) state = migrateSeed(state, version)
    // Fill in preferences added after this state was saved
    state = { ...state, servers: { ...state.servers, folders: state.servers.folders ?? {} } }
    return { ...state, threads: state.threads ?? {}, groups: state.groups ?? [], prefs: { ...initialPrefs, ...state.prefs } }
  } catch {
    return undefined
  }
}

/** Drop inline file data so the rest of the state still fits in storage */
const withoutFileData = (state: PersistedState): PersistedState => ({
  ...state,
  messages: Object.fromEntries(
    Object.entries(state.messages).map(([id, list]) => [
      id,
      list.map(m =>
        m.attachments ? { ...m, attachments: m.attachments.map(a => ({ ...a, url: '' })) } : m
      ),
    ])
  ),
})

export const saveState = (state: RootState) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ui, ...persisted } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutFileData(persisted)))
    } catch {
      // Storage unavailable (private mode) – the app keeps working in memory
    }
  }
}

export const clearState = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
