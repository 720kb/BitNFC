import React from 'React'

class Comp extends React.Component {
  componentDidMount() {
    if (this.props.children) this.props.store = this.props.children.store
  }
}

Comp.contextTypes = { store: React.PropTypes.object }

export default Comp
