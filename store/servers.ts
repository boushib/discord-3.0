import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SERVERS } from '../constants'
import { Server } from '../models'

type ServersState = {
  isLoading: boolean
  error?: string
  servers: Server[]
  currentServer: Server
}

const initialState: ServersState = {
  isLoading: true,
  servers: [],
  currentServer: SERVERS[0],
}

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    fetchServersPending(state: ServersState) {
      state.isLoading = true
    },
    fetchServersSuccess(state: ServersState, action: PayloadAction<Server[]>) {
      state.isLoading = false
      state.servers = action.payload
    },
    fetchServersError(state: ServersState, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    setCurrentServer(state: ServersState, action: PayloadAction<Server>) {
      state.currentServer = action.payload
    },
  },
})

export const {
  fetchServersPending,
  fetchServersSuccess,
  fetchServersError,
  setCurrentServer,
} = serversSlice.actions
export const serversReducer = serversSlice.reducer
