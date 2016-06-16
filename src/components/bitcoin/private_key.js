import React  from 'React'
import Comp  from '../comp'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'


class PrivateKey extends Comp {
  // componentDidMount()
  render () {
    return (
      <div>
        <div className="s30" />
        <strong>PrivateKey (backup this!)</strong>
        <Provider store={store}>
          <p>{store.getState().privateKey.toWIF()}</p>
        </Provider>
      </div>
    )
  }
}

export default PrivateKey
