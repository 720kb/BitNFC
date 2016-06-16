import React        from 'React'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'
import { Link }     from 'ReactRouter'
import Comp         from '../comp'
import QRAddress    from '../qr/qr_address'

export default class Receive extends Comp {
  render () {
    return (
      <div>
        <h1>Receive</h1>
        <Provider store={store}>
          <div>
            <div>Antani</div>
            <QRAddress />
          </div>
        </Provider>
      </div>
    )
  }
}
