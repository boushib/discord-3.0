import { combineReducers } from 'redux'
import { serversReducer as servers } from './servers'

const rootReducer = combineReducers({ servers })

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
