import React        from 'React'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'
import { Link }     from 'ReactRouter'
import Comp         from '../comp'
import QRAddress    from '../qr/qr_address'
import AddressBalanceFiat  from '../bitcoin/address_balance_fiat'

export default class Receive extends Comp {
  render () {
    return (
      <section className="receive">
        <h1>Receive</h1>
        <Provider store={store}>
          <div>
            <QRAddress />
            <AddressBalanceFiat />
          </div>
        </Provider>
      </section>
    )
  }
}
