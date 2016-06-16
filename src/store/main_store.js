import actions from '../actions/actions'
import defaultState from './default_state'

let init = false


const catchAll = () => {
  console.error("Error:", err)
  return Promise.reject(err)
}

const mainStore = (state = defaultState, action) => {

  //reducer composition (action can be handled by 0,1 or more reducers)

  console.log("ACTION:", action.type)
  switch (action.type) {

    case "GET_ANTANI":
      // getAntani()
      state.antani = action.antani
      return state

    case "PING":
      // ping()
      state.ping = "pong"
      return state

    default:
      if (init)
        console.log(`action: ${action.type} - no state change`)
      init = true
      return state
  }
}

//// stricter, legacy version
//
// import { createStore } from 'Redux'
//
// const reducer = null
//
// const defaultReducer = () => { }
//
// const antaniStore = (state, _reducer) =>  {
//   if (!reducer)  reducer = _reducer
//   if (!reducer)  reducer = defaultReducer
//
//   const devToolsAntani = window.devToolsExtension && window.devToolsExtension()
//   const store = createStore(
//     reducer,
//     state,
//     devToolsAntani
//   )
//   return store
// }


export default mainStore
// TODO: export antaniStore
