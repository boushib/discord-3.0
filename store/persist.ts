import type { RootState } from '.'
import { createSeedMessages, SEED_SERVERS } from '../constants/seed'
import { initialPrefs, SEED_VERSION } from './prefs'

const STORAGE_KEY = 'discord-clone:v1'

type PersistedState = Omit<RootState, 'ui'>

// Demo servers from the first seed that were replaced in v2
const RETIRED_SERVERS = ['s-topshot', 's-nflallday', 's-nextjs', 's-eternal', 's-ac']
const RETIRED_CHANNEL_PREFIXES = ['c-ts-', 'c-nfl-', 'c-next-', 'c-et-', 'c-ac-']

/**
 * Swap the old demo servers for the current seed ones while keeping
 * everything the user made: their own servers, DMs, messages and settings.
 */
const migrateSeed = (state: PersistedState): PersistedState => {
  const byId = { ...state.servers.byId }
  RETIRED_SERVERS.forEach(id => delete byId[id])
  for (const server of SEED_SERVERS) byId[server.id] ??= server
  const seedOrder = SEED_SERVERS.map(s => s.id)
  const userOrder = state.servers.order.filter(id => byId[id] && !seedOrder.includes(id))

  const messages = Object.fromEntries(
    Object.entries(state.messages).filter(([id]) => !RETIRED_CHANNEL_PREFIXES.some(p => id.startsWith(p)))
  )
  for (const [id, list] of Object.entries(createSeedMessages(Date.now()))) messages[id] ??= list

  return {
    ...state,
    servers: { byId, order: [...seedOrder, ...userOrder] },
    messages,
    prefs: { ...state.prefs, seedVersion: SEED_VERSION },
  }
}

export const loadState = (): Partial<PersistedState> | undefined => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    let state = JSON.parse(raw) as PersistedState
    if ((state.prefs?.seedVersion ?? 1) < SEED_VERSION) state = migrateSeed(state)
    // Fill in preferences added after this state was saved
    return { ...state, threads: state.threads ?? {}, prefs: { ...initialPrefs, ...state.prefs } }
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
