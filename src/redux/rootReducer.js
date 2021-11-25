import { combineReducers } from 'redux'
import linkPersistReducer from './link-persist/linkPersistReducer'

const rootReducer = combineReducers({
  linkPersist: linkPersistReducer
})

export default rootReducer
