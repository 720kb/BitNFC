import React  from 'React'
import Comp  from '../comp'
import fiatRate from '../../api/fiat_rate'

// <AddressBalanceFiat address='1abcde'>
//
// will render a balance in USD

// <AddressBalanceFiat address='1abcde' rate="eur">
//
// will return the rate in EUR

const defaultRate = "usd"

class AddressBalanceFiat extends Comp {
  constructor(props) {
    super(props)
    this.state = { rate: 0 }
    let rate = props.rate
    if (!rate) rate = defaultRate
    this.rate = rate
  }

  componentDidMount() {
    fiatRate(this.rate)
      .catch(console.error)
      .then((resp) => {
        return resp.data.rate
      })
      .then((rate) => {
        this.setState({ rate: rate })
      })
      .catch(console.error)
  }

  render () {
    let store = this.getStore()
    let balance = store.balance || 0
    balance = balance / 100000000 *  this.state.rate
    balance = Math.round(balance * 100) / 100
    return (
      <div className="balance fiat">
        <div>{balance} {this.rate.toUpperCase()}</div>
      </div>
    )
  }
}

export default AddressBalanceFiat
