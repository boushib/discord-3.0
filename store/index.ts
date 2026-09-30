import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { CURRENT_USER_ID } from '../constants'
import { dmsReducer } from './dms'
import { groupsReducer } from './groups'
import { messagesReducer } from './messages'
import { loadState, saveState } from './persist'
import { prefsReducer } from './prefs'
import { readStateReducer } from './readState'
import { leaveVoice, serversReducer } from './servers'
import { threadsReducer } from './threads'
import { uiReducer } from './ui'
import { usersReducer } from './users'

const rootReducer = combineReducers({
  servers: serversReducer,
  dms: dmsReducer,
  groups: groupsReducer,
  messages: messagesReducer,
  threads: threadsReducer,
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
    // Voice connections don't survive a reload
    store.dispatch(leaveVoice(CURRENT_USER_ID))

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
export * from './groups'
export * from './messages'
export * from './prefs'
export * from './readState'
export * from './servers'
export * from './threads'
export * from './ui'
export * from './users'
