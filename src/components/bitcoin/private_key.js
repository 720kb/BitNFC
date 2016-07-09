import React  from 'React'
import Comp  from '../comp'
import { Provider } from 'ReactRedux'
import store        from '../../store/store'


class PrivateKey extends Comp {
  constructor(props) {
    super(props)
    this.state = {
      toggled: false
    }

    this._toggleKey = this._toggleKey.bind(this)
  }

  _onState() {
    return {
      styles: {
        display: "block",
      },
      verb: "Hide"
    }
  }

  _offState() {
    return {
      styles: {
        display: "none",
      },
      verb: "Reveal"
    }
  }

  render() {
    let {verb, styles} = this.state.toggled ? this._onState() : this._offState()
    return (
      <div>
        <div>
          <div className="s60" />
          <a className="btn button btn-danger button-danger" onClick={this._toggleKey}>
            {verb} Private Key
          </a>
        </div>
        <div style={styles}>
          <strong>PrivateKey (backup this!)</strong>
          <Provider store={store}>
            <p>{store.getState().privateKey.toWIF()}</p>
          </Provider>
        </div>
      </div>
    )
  }

  _toggleKey(evt) {
    let newState = {
      toggled: !this.state.toggled,
    }
    let state = Object.assign(this.state, newState)
    this.setState(state)
  }

}

export default PrivateKey


// in the future maybe?
//
// let state = {
//   ...this.state,
//   ...styles,
// }
// console.log(state)
// this.state = state
