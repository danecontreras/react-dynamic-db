import { combineReducers } from 'redux'
import linkPersistReducer from './link-persist/linkPersistReducer'
import persistExampleReducer from './persist-example/persistExampleReducer'

const rootReducer = combineReducers({
  persistExample: persistExampleReducer,
  linkPersist: linkPersistReducer
})

export default rootReducer
