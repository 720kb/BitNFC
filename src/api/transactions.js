import axios from 'axios'

const host = "api.blockcypher.com"
const base = `https://${host}/v1/btc/main/addrs`

const Transactions = {}

const pReject = (err)  => Promise.reject(err)

const confirmations = (confNum) => {
  // confirmations string - user friendly message
  return (confNum > 5) ? "6+" : confNum
}

const toMbtc = (satoshis) => {
  let mbtcs = satoshis / 100000
  return mbtcs
}

const parseTx = (tx) => {
  // tx formatted
  let txFmt = {
    confirmations: confirmations(tx.confirmations),
    value:         tx.value,
    valueMbtc:     toMbtc(tx.value),
    confirmedAt:   tx.confirmed,
    spent:         tx.spent,
    hash:          tx.tx_hash,
  }
  return txFmt
}

Transactions.all = (address) => {
  return axios.get(`${base}/${address}`)
    .catch(pReject)
    .then((resp) => {
      return resp.data.txrefs
    })
    .catch(pReject)
    .then((txs) => {
      return txs.map((tx) => {
        return parseTx(tx)
      })
    })
    .catch(pReject)
}

export default Transactions
