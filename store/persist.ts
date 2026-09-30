import type { RootState } from '.'

const STORAGE_KEY = 'discord-clone:v1'

type PersistedState = Omit<RootState, 'ui'>

export const loadState = (): Partial<PersistedState> | undefined => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedState) : undefined
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
