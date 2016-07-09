import React  from 'React'
import Comp  from '../comp'
import actions from '../../actions/actions'

class RefreshBalanceButton extends Comp {
  render() {
    return (
      <div className="refreshBalance">
        <button onClick={this._refreshBalance}>↻</button>
      </div>
    )
  }

  _refreshBalance() {
    actions.getBalance()
  }
}

export default RefreshBalanceButton
