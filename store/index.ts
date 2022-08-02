import { configureStore } from '@reduxjs/toolkit'
import serversReducer from './servers'

const store = configureStore({ reducer: { servers: serversReducer } })

export type RootState = ReturnType<typeof store.getState>

export default store
