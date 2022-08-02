import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Server } from '../models'
type ServersState = {
  isLoading: boolean
  error?: string
  servers: Server[]
}

const serversSlice = createSlice({
  name: 'todos',
  initialState: {
    isLoading: true,
    servers: [],
  },
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
  },
})

export const { fetchServersPending, fetchServersSuccess, fetchServersError } =
  serversSlice.actions
export default serversSlice.reducer
