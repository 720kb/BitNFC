import React  from 'React'
import Comp  from '../comp'
import bitcore from 'bitcore-lib'

console.log(bitcore)
var privateKey = new bitcore.PrivateKey()
var privateKeyWif = privateKey.toWIF()

class PrivateKey extends Comp {
  render () {
    return (
      <div>
        PrivateKey
      </div>
    )
  }
}

export default PrivateKey
