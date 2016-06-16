import store from '../store/store'

const catchAll = (err) => {
  console.error("Error:", err.stack)
}

const someSubAction = () => {
  // ...
}

const actions = {
  comeSeFosseAntani: () => {
   store.dispatch({ type: 'ANTANI', antani: "antani! (foobar)" })
 },
}

export default actions
