import store from '../store/store'
import Balance from '../api/balance'

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

  // API actions
  getBalanceCall: (address) => {
    Balance.get(address)
      .then((balance) => {
        actions.gotBalance(balance)
      })
  },
}

export default actions
