import { Server } from '../../models'
import { FetchServersAction } from '../actions'
import { FetchServersAT } from '../actions/types'

type ServersState = {
  isLoading: boolean
  error?: string
  servers: Server[]
}
const serversInitialState: ServersState = {
  isLoading: true,
  servers: [],
}

export const serversReducer = (
  state: ServersState = serversInitialState,
  action: FetchServersAction
): ServersState => {
  switch (action.type) {
    case FetchServersAT.PENDING:
      return serversInitialState
    case FetchServersAT.SUCCESS:
      return { isLoading: false, servers: action.payload }
    case FetchServersAT.ERROR:
      return { ...state, isLoading: false, error: action.payload }
    default:
      return state
  }
}
