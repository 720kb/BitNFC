import React  from 'React'
import Comp  from '../comp'

const bcypherTXUrl = (txId) => {
  return `https://live.blockcypher.com/btc/tx/${txId}/`
}

const dateFmt = (date) => {
  return new Date(date).toDateString()
}

export default class Transaction extends Comp {
  render() {
    const tx = this.props.tx
    const id = tx.id
    // const id = this.props.txid
    // const tx = this.getStore().transactions.find((tx) => {
    //   return tx.id == id
    // })
    return (
      <div>
        <strong>Transaction</strong>
        <div className="confirmations right">{tx.confirmations}</div>
        <div className="clearRight"></div>
        <div className="confirmedAt right">{dateFmt(tx.confirmedAt)}</div>
        <div className="txHash">{tx.hash}</div>

        <div className="value">{tx.valueMbtc} mBTC</div>
        <div className="spent">{(tx.spent) ? "Spent" : "Available"}</div>
        <p>
          <a href={bcypherTXUrl(id)}>{id}</a>
        </p>
      </div>
    )
  }
}
