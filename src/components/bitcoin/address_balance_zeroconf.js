import React  from 'React'
import Comp  from '../comp'

class AddressBalanceZeroconf extends Comp {
  render () {
    let store = this.getStore()
    let balance     = store.balance
    let balanceZero = store.balanceZeroconf
    this.balance = balanceZero
    let balanceDifference = balance != balanceZero
    return (
      <div className="balance btc mbtc">
        {(balanceDifference) ? this._renderBalance() : ""}
      </div>
    )
  }

  _renderBalance() {
    return (
      <div>
        <div className="s10" />
        <div>New Balance:</div>
        <div>{this.balance / 100000} mBTC</div>
        <div>(waiting to be confirmed...)</div>
      </div>
    )
  }
}

export default AddressBalanceZeroconf
