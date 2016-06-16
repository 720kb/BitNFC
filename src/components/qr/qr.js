import React  from 'React'
import Comp  from '../comp'
import QRCode from 'QRCode'


const options = {
  width:        400,
  height:       400,
  colorDark:    "#000000",
  colorLight:   "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
}

class QR extends Comp {
  componentDidMount()  {
    new QRCode(this.refs.qr, _.extend(
      {
        text: "http://jindo.dev.naver.com/collie",
      },
      options
    ))
  }

  render () {
    // let qr = new QRCanvas.QRCodeDraw()
    return (
      <div ref='qr' className="qrCode" />
    )
  }
}

export default QR
