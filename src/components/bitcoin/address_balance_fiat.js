import React  from 'React'
import Comp  from '../comp'
import axios from 'axios'

// <AddressBalanceFiat address='1abcde'>
//
// will render a balance in USD

// <AddressBalanceFiat address='1abcde' rate="eur">
//
// will return the rate in EUR

const defaultRate = "usd"
const fiatRate = (rate) => {
  return axios.get(`https://bitpay.com/api/rates/${rate}`)
}

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
    let balance = this.props.balance || 0
    return (
      <div className="balance">
        <div>{balance * this.state.rate} {this.rate.toUpperCase()}</div>
      </div>
    )
  }
}

export default AddressBalanceFiat
