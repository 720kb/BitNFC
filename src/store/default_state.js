const bitcore = require('bitcore-lib')

const store = localStorage // just a shorter alias for localStorage
let privateKey = null

// code taken from PracticalBlockchainDevelopmentBook/Chapter02/bitcore_lib_browser
if (store.privateKey) {
  console.log("Private key present in localStorage")
  console.log("Private key:")
  console.log(store.privateKey)
  privateKey = new bitcore.PrivateKey(store.privateKey)
} else {
  privateKey = new bitcore.PrivateKey()
  let privateKeyWif = privateKey.toWIF()
  store.privateKey  = privateKeyWif
  console.log("Private key saved successfully!")
  console.log("Refresh the page or check your 'Resources > Local Storage' from the developer tools")
}

const address = privateKey.toAddress().toString()

let tx1 = "7e10e30c162bcc4b74af47e0c073e764b688a2a6e453dca70e8d711d378eac0b"
let tx2 = "66ff01106d9cf9e283688c4262a0e6fe5dda8dc464835431744a070030511723"
let tx3 = "1f7eb8ac37f907c6f5f3932b2e2b0ff55275b971f1c91067c73691b9320c3cd0"

const defaultState = {
  address:         address,
  privateKey:      privateKey,
  balance:         0,
  balanceZeroConf: 0,
  transactions:    [tx1, tx2, tx3],
  antani:          "-" // TODO remove debug
}

export default defaultState
