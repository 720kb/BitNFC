import React  from 'React'
import Comp  from '../comp'

// <AddressBalance address='1abcde'>
//
// will render a balance in mBTC

// <AddressBalance address='1abcde' unit="bits">
//
// will return the balance in bits


class AddressBalance extends Comp {
  render () {
    let state = this.context.store.getState()
    let balance = state.balance
    return (
      <div className="balance">
        <div>
          <strong>Balance:</strong>
        </div>
        <div className="s10"></div>
        <div>{balance / 100000} mBTC</div>
      </div>
    )
  }
}

export default AddressBalance
