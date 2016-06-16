import React, { Component } from 'React'
import { Link } from 'ReactRouter'

import Comp     from './comp'
import Receive  from './receive/receive'
import Nav      from './main/nav'


export default class Main extends Comp {
  render() {
    return (
      <div className="main">
        {this.props.children || (<Receive />)}
        <Nav />
      </div>
    )
  }
}
