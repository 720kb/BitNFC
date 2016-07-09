import store from '../store/store'

const actions = {
  gotBalance: (balance) => {
    store.dispatch({ type: 'GOT_BALANCE', balance: balance })
  },
  gotTxs: (transactions) => {
    store.dispatch({ type: 'GOT_TXS', transactions: transactions })
  },
  getBalance: () => {
    store.dispatch({ type: 'GET_BALANCE' })
  },
}

export default actions
