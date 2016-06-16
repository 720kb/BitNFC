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
    let balance = this.getStore().balance
    return (
      <div className="balance btc mbtc">
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
