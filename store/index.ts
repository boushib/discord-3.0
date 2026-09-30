import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { dmsReducer } from './dms'
import { messagesReducer } from './messages'
import { loadState, saveState } from './persist'
import { prefsReducer } from './prefs'
import { readStateReducer } from './readState'
import { serversReducer } from './servers'
import { uiReducer } from './ui'
import { usersReducer } from './users'

const rootReducer = combineReducers({
  servers: serversReducer,
  dms: dmsReducer,
  messages: messagesReducer,
  users: usersReducer,
  readState: readStateReducer,
  prefs: prefsReducer,
  ui: uiReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
  const isBrowser = typeof window !== 'undefined'
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: isBrowser ? loadState() : undefined,
  })

  if (isBrowser) {
    let timeout: ReturnType<typeof setTimeout> | undefined
    store.subscribe(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => saveState(store.getState()), 300)
    })
  }

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']

export * from './dms'
export * from './messages'
export * from './prefs'
export * from './readState'
export * from './servers'
export * from './ui'
export * from './users'
