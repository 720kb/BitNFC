import Client from "Client"

// Balance returns the balance of a bitcoin address at both zero and one confirmations.

// It's useful for the user to know the balance at zero confirmations to see if a transaction is due to be received, otherwise he/she will have to wait for the next block to see how much he's going to receive or how much he/she will have remaining after sending some funds.

class Balance {
  static get(address) {
    return Promise.all([
      Client.getBalance(address, 0),
      Client.getBalance(address)
    ])
      .catch(console.error)
      .then((balances) => {
        let balance = {
          balance:         balances[0],
          balanceZeroConf: balances[1]
        }
        return balance
      })
      .catch(console.error)
  }
}

export default Balance
