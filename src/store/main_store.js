import actions from '../actions/actions'
import defaultState from './default_state'

let init = false


const mainStore = (state = defaultState, action) => {
  //reducer composition (action can be handled by 0,1 or more reducers)

  console.log("ACTION:", action.type)
  switch (action.type) {

    case "GOT_BALANCE":
      Object.assign(state, action.balance)
      return state

    case "GOT_TXS":
      state.transactions = action.transactions
      return state

    case "GET_ANTANI":
      // getAntani()
      state.antani = action.antani
      return state

    case "PING":
      // ping()
      state.ping = "pong"
      return state

    case "GET_BALANCE":
      actions.getBalanceCall(state.address)
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
