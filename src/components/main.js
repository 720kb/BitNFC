import React, { Component } from 'React'
import { Link } from 'ReactRouter'

import Comp     from './comp'
import Receive  from './receive/receive'
import Nav      from './main/nav'

import { Provider } from 'ReactRedux'
import store  from '../store/store'

export default class Main extends Comp {
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <Nav />
            {this.props.children || (<Receive store={store} />)}
          </div>
        </Provider>
      </div>
    )
  }
}
