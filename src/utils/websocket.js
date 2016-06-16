import store from '../store/store'

var PENDING_TXST, socket, updateStatus, updateStatusDebounced, wsHost

// Notifier

updateStatus = function(status) {
  if (!status) return
  if (status == "PONG") return
  if (status == "antani") {
    console.log(status)
    store.dispatch({ type: 'ANTANI', status: status })
  }
}

updateStatusDebounced = _.debounce(updateStatus, 200) 

const websocketInit = () => {

  wsHost = "localhost:3001"

  socket = new WebSocket("ws://" + wsHost)

  socket.onopen = function(event) {
    return console.log("PING")
  }

  socket.onmessage = function(event) {
    var status
    status = event.data
    console.log(status)
    if (status) {
      updateStatusDebounced(status)
      // ...
    }
  }
}

export default websocketInit
