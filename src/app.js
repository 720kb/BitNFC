import React from 'React'
import { Provider } from 'ReactRedux'
import { render } from 'ReactDOM'

import store from './store/store'
import startup from './startup'
import Comp from './components/comp'
import Main from './components/main'
import NotFound from './components/main/not_found'


window.storeDebug = store.getState() // FIXME: disable in production

// temporary router goes here ---- <RouterComp />

import { Router, Route, IndexRoute, Link, hashHistory } from 'ReactRouter'
import Receive        from './components/receive/receive'
import Send           from './components/send/send'
import Transactions   from './components/transactions/transactions'

// dir struct and dev tool conf: http://www.jchapron.com/2015/08/14/getting-started-with-redux/

const routes =
  <Route path="/" component={Main}>
    <Route path="/receive"      component={Receive} />
    <Route path="/send"         component={Send} />
    <Route path="/transactions" component={Transactions} />
    <Route path="*"             component={NotFound}/>
  </Route>


// main component, calls the global re-render
//
const mainRender = () => {
  render(
    <div>
      <h1>App</h1>
      <Router history={hashHistory}>
        {routes}
      </Router>
    </div>,
    document.querySelector('.container')
  )
}


// main render!!

mainRender()

store.subscribe((evt) =>
  mainRender()
)


// startup has the task of filling in the stores with startup data
startup()
