import { combineReducers } from 'redux'
import jwtTokenReducer from './jwt-token/jwtTokenReducer'
import linkPersistReducer from './link-persist/linkPersistReducer'

const rootReducer = combineReducers({
  linkPersist: linkPersistReducer,
  jwtToken: jwtTokenReducer
})

export default rootReducer
