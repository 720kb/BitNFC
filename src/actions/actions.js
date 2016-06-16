import store from '../store/store'

const catchAll = (err) => {
  console.error("Error:", err.stack)
}

const someSubAction = () => {
  // ...
}

const actions = {
  gotBalance: (balance) => {
    store.dispatch({ type: 'GOT_BALANCE', balance: balance })
  },
  comeSeFosseAntani: () => {
    store.dispatch({ type: 'ANTANI', antani: "antani! (foobar)" })
  },
}

export default actions
