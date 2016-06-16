import React  from 'React'
import Comp  from '../comp'
import Transaction  from './transaction'

export default class TransactionList extends Comp {
  transactionList(transactions) {
    let rows = []
    transactions.forEach((tx, _) => {
      rows.push(
        <Transaction key={tx.id} attributes={tx.attributes} />
      )
    })
    return rows
  }

  render() {
    let transactions = this.context.store.getState().transactions
    return (
      <div>
        Transaction count: {transactions.length}
        <div>{this.transactionList(transactions)}</div>
        // <div>{transactions.attributes.name}</div>
        // <div>{transactions.attributes.owner}</div>
      </div>
    )
  }
}
