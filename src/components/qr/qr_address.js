import React    from 'React'
import ReactDOM from 'ReactDOM'
import Comp     from '../comp'
import QR       from './qr'
import Address  from '../bitcoin/address'

export default class QRAddress extends Comp {
  constructor(props) {
    super(props)
    this.render = this.render.bind(this)
  }
  componentDidMount() {
    this.qrElem = ReactDOM.findDOMNode(this.refs.qr)
    // $('#fullscreen-button').on('click', function() {  } });
    this.qrElem.addEventListener('click', this.myHandler);
  }
  myhandler() {
    alert("x")
    // () => {
    //   var doc = document.documentElement;
    //   if (doc.requestFullscreen) { doc.requestFullscreen(); }
    // }
  }
  render() {
    let address = this.getStore().address
    return (
      <div>
        <QR ref="qr" address={address} onClick={this.qrElem && this.qrElem.requestFullscreen}/>
        <Address address={address}/>
      </div>
    )
  }
}
