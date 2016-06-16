import React  from 'React'
import Comp  from '../comp'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'
import TransactionList  from './transaction_list'

export default class Transactions extends Comp {
  render() {
    return (
      <section className="transactions">
        <Provider store={store}>
          <TransactionList />
        </Provider>
      </section>
    )
  }
}
