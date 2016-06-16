import store from './store/store'
import websocketInit from './utils/websocket'

import testAPI from './api/_test'

const catchAll = (err) => {
  console.error("Error:", err.stack)
  return Promise.reject(err)
} // TODO: move to utils

const startup = () => {

  console.log("STARTUP!")

}

export default startup
