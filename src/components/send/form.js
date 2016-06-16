import React  from 'React'
import Comp  from '../comp'

class Form extends Comp {
  render() {
    return (
      <div>
        <label>
          Address:
          <div className="s10" />
          <input name="to"     type="text" placeholder="1....." />
        </label>
        <div className="s30" />
        <label>
          Amount:
          <div className="s10" />
          <input name="amount" type="text" placeholder="0.10" />
          <div className="hoverInput">mBTC</div>
        </label>
        <div className="s30" />
        <input type="submit" value="Send" />
      </div>
    )
  }
}

export default Form
