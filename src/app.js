import React from 'React'
import { Provider } from 'ReactRedux'
import { render } from 'ReactDOM'

import store from './store/store'
import startup from './startup'
import catchErrors from './errors'
import mainRender from './main_render'
import Comp from './components/comp'
import Main from './components/main'
import NotFound from './components/main/not_found'


window.storeDebug = store.getState() // FIXME: disable in production




// Main Components

import {  Route, IndexRoute } from 'ReactRouter'
import Receive        from './components/receive/receive'
import Send           from './components/send/send'
import Transactions   from './components/transactions/transactions'


// Routes

const routes =
  <Route path="/" component={Main}>
    <Route path="/receive"      component={Receive} />
    <Route path="/send"         component={Send} />
    <Route path="/transactions" component={Transactions} />
    <Route path="*"             component={NotFound}/>
  </Route>



// Main render (execution)

try {
  mainRender(routes)
} catch (err) {
  catchErrors(err)
  throw(err)
}

store.subscribe((evt) =>
  mainRender()
)



// startup has the task of filling in the stores with startup data
startup()
