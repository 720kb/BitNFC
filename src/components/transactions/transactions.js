import React  from 'React'
import Comp  from '../comp'
import TransactionList  from './transaction_list'

export default class Transactions extends Comp {
  render() {
    return (
      <div>
        <TransactionList />
      </div>
    )
  }
}
