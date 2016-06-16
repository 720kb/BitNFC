import React, { Component } from 'React'
import { Link } from 'ReactRouter'

import Comp from '../comp'
export default class Nav extends Comp {
  componentDidMount() {
    let nav = this.refs.nav
    let offset = nav.offsetTop
    console.log(offset)
  }

  render () {
    return (
      <nav ref="nav" style={{fontSize: '2em', marginTop: "50px" }}>
        <ul>
          <li><Link to='/'>Receive</Link></li>
          <li><Link to='/send'>Send</Link></li>
          <li><Link to='/transactions'>Transactions</Link></li>
        </ul>
      </nav>
    )
  }
}
