import React  from 'React'
import Comp  from '../comp'

const bcypherTXUrl = (txId) => {
  return `https://live.blockcypher.com/btc/tx/${txId}/`
}

export default class Transaction extends Comp {
  render() {

    return (
      <div>
        <strong>Transaction</strong>
        <p>
          <a href={bcypherTXUrl(this.props.txid)}>{this.props.txid}</a>
        </p>
      </div>
    )
  }
}
