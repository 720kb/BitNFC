import React  from 'React'
import Comp  from '../comp'

class Address extends Comp {
  render () {
    return (
      <div>
        <label>Your Address:</label>
        <div className="s10" />
        <form>
          <input type="text" placeholder="1...." value={this.props.address} disabled />
        </form>
      </div>
    )
  }
}

export default Address
