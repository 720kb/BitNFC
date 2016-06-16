import React  from 'React'
import Comp  from '../comp'

class Form extends Comp {
  render() {
    return (
      <div>
        <input name="to" />
        <input name="amount" />
        <input type="submit" value="Send" />
      </div>
    )
  }
}

export default Form
