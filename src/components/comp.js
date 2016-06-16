import React from 'React'

class Comp extends React.Component {
  componentDidMount() {
    if (this.props && this.props.children && !this.props.route) {
      console.log(this.props)
      this.props.store = this.props.children.store
    }
  }

  getStore() {
    return this.context.store.getState()
  }
}

Comp.contextTypes = { store: React.PropTypes.object }

export default Comp
