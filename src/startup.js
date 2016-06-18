import store from './store/store'
import websocketInit from './utils/websocket'
import Balance from "./api/balance"
import Transactions from "./api/transactions"
import actions from "./actions/actions"

const pReject = (err)  => Promise.reject(err)
const pLog     = (resp) => {
  console.log(resp)
  return resp
}

const startup = () => {

  const state = store.getState()

  console.log("STARTUP!")

  Balance.get(state.address)
    .catch(pReject)
    .then(actions.gotBalance)
    .catch(pReject)

  Transactions.all(state.address)
    .then(pLog)
    .then(actions.gotTxs)
    .catch(pReject)
}

export default startup
