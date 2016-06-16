import React from 'React'
import { render } from 'ReactDOM'
import { Router, Route, IndexRoute, Link, hashHistory } from 'ReactRouter'

// main component, calls the global re-render
//
const mainRender = (routes) => {
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

export default mainRender
