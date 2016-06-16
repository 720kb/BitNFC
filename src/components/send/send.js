import React  from 'React'
import Comp  from '../comp'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'
import Form         from './form'

export default class Send extends Comp {
  render () {
    return (
      <section className="send">
        <Provider store={store}>
          <div>
            <h1>Send</h1>
            <div className="s40" />
            <Form store={store} />
          </div>
        </Provider>
      </section>
    )
  }
}
