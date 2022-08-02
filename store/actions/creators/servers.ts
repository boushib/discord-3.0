import { Dispatch } from 'redux'
import { FetchServersAction } from '../'
import { FetchServersAT } from '../types'
import api from '../../../api'

export const fetchServers = () => {
  return async (dispatch: Dispatch<FetchServersAction>) => {
    dispatch({ type: FetchServersAT.PENDING })
    try {
      const { data } = await api.get('/servers')
      dispatch({ type: FetchServersAT.SUCCESS, payload: data.servers })
    } catch (error: any) {
      dispatch({ type: FetchServersAT.ERROR, payload: error.message })
    }
  }
}
