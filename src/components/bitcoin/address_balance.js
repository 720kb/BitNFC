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
    return (
      <div className="balance">
        <div></div>
      </div>
    )
  }
}

export default AddressBalance
