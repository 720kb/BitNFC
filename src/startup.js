import store from './store/store'
import websocketInit from './utils/websocket'
import Balance from "./api/balance"
import actions from "./actions/actions"

const catchAll = (err) => {
  console.error("Error:", err.stack)
  return Promise.reject(err)
} // TODO: move to utils

const startup = () => {

  const state = store.getState()

  console.log("STARTUP!")

  Balance.get(state.address)
    .catch(console.error)
    .then(actions.gotBalance)
    .catch(console.error)

}

export default startup
