import { configureStore } from '@reduxjs/toolkit'
import { serversReducer } from './servers'

export const makeStore = () =>
  configureStore({ reducer: { servers: serversReducer } })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export * from './servers'
