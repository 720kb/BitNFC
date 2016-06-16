import React  from 'React'
import Comp  from '../comp'
import Transaction  from './transaction'

export default class TransactionList extends Comp {
  transactionList(transactions) {
    let rows = []
    transactions.forEach((tx, _) => {
      rows.push(
        <Transaction key={tx} txid={tx} />
      )
    })
    return rows
  }

  render() {
    let transactions = this.context.store.getState().transactions
    return (
      <div>
        <h1>Transactions ({transactions.length})</h1>
        <div className="s20"></div>
        <div>{this.transactionList(transactions)}</div>
      </div>
    )
  }
}
