import React  from 'React'
import Comp  from '../comp'

export default class Transaction extends Comp {
  render() {
    let transactions = this.props.store.getState().transactions
    return (
      <div>
        Transaction
      </div>
    )
  }
}
