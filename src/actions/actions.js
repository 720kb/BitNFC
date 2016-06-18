import store from '../store/store'

const actions = {
  gotBalance: (balance) => {
    console.log("GOT_BALANCE", balance)
    store.dispatch({ type: 'GOT_BALANCE', balance: balance })
  },
}

export default actions
