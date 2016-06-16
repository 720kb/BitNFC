import React  from 'React'
import Comp  from '../comp'

export default class Transaction extends Comp {
  render() {

    return (
      <div>
        <strong>Transaction</strong>
        <p>{this.props.txid}</p>
      </div>
    )
  }
}
