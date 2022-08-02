import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const store = createStore(rootReducer, {}, applyMiddleware(thunk))

export * as actionCreators from './actions/creators'
export * from './reducers'
export default store
