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

export const saveState = (state: RootState) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ui, ...persisted } = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // Storage full or unavailable (private mode) – the app keeps working in memory
  }
}

export const clearState = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
