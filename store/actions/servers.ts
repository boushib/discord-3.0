import { Server } from '../../models'
import { FetchServersAT } from './types'

type FetchServersPendingAction = {
  type: FetchServersAT.PENDING
}

type FetchServersSuccessAction = {
  type: FetchServersAT.SUCCESS
  payload: Server[]
}

type FetchServersErrorAction = {
  type: FetchServersAT.ERROR
  payload: string
}

export type FetchServersAction =
  | FetchServersPendingAction
  | FetchServersSuccessAction
  | FetchServersErrorAction
