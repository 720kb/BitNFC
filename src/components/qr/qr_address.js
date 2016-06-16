import React    from 'React'
import Comp     from '../comp'
import QR       from './qr'
import Address  from '../bitcoin/address'

export default class QRAddress extends Comp {
  render() {
    let address = this.getStore().address
    return (
      <div>
        <QR address={address}/>
        <Address address={address}/>
      </div>
    )
  }
}
