import axios from 'axios'

const fiatRate = (rate) => {
  return axios.get(`https://bitpay.com/api/rates/${rate}`)
}

export default fiatRate
