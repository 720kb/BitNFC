import React  from 'React'
import { Provider } from 'ReactRedux'
import { Link } from 'ReactRouter'
import store  from '../../store/store'
import Comp  from '../comp'

export default class Send extends Comp {
  render () {
    return (
      <div>
        <h1>Send</h1>
        <Provider store={store}>
          <div>Antani</div>
        </Provider>
      </div>
    )
  }
}
