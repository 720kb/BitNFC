import React    from 'React'
import Comp     from '../comp'
import QR       from './qr'
import Address  from '../bitcoin/address'

export default class QRAddress extends Comp {
  render () {
    return (
      <div>
        QRAddress
        <QR />
        <Address />
      </div>
    )
  }
}
