# BitNFC

[screenshots]


### Download

<apk link>

### Install

TODO

enjoy!

## Development

### Prerequisites

You need Android Studio SDK with SDK v.22

### Install

download the project (or git clone it)

enter the dir

```sh
npm install cordova -g

npm install && bower install && ionic state reset


ionic run android # to run it on device (or simulator)

```

or

```sh
ionic serve # to run it locally on a browser (of course NFC will not work)
```

npm install && bower install && ionic state reset


### NFC Format SMS (the only one that is copy-pastable)

This is the format we are using to encode the tag with:

```
s:0?body=5privateKey
```

It's actually an SMS format:

Does it resemble something?

```
mailto:user@example.com
```


```
sms:URL
```

```
sms:path/?var=foo
```

```
s:path/?var=foo
```


on standard Mifare tags usually there is space for another NFC Record

you could embed a link



## TODO

- integrate clipboard - look at ngcordova docs

<http://ngcordova.com/docs/plugins/clipboard>


- regex - address

/^[13][^O0Il]{25,33}/

- regex - pvt key

/^5[HJK][1-9A-Za-z][^OIl]{49}/


### Main actions: (v 0.0.1)


```txt

- Load NFC tag (Send)
  (empty tag)
  - generate private key
  - get address
  - send X mBTC from your phone wallet to it

  (full tag)
  - is a private key?
    - go to Swipe NFC Tag
  - is another tag?
    - ask for deletion
  - go to empty tag


- Swipe NFC Tag (Receive)
  - get private key
  - send X mBTC from that to your phone wallet


```



### Main wallet actions (required)

- generate own address
- send payments
- nfc tags handling


### Extras - stage 1 (good to have)

- settings: export own private key
- generate qr code to receive payment  


### Extras - stage 2 (eventually)

- embed link to url as other NFC record or dedicated url like bitnfc:// or bitcoin://import/pvtkey
- scan qr code to send payment
- export private key via SMS
- use password protected nfc tokens
- use BIP38 password protected private keys


---

### Notes


```
send payments:
- get utxo
- create transaction (utxo)
- push transaction
```

---


#### bitcore - units

```js
bitcore - units - rats
var rate = 217.096674; // get('https://bitpay.com/api/rates')
var unit = new bitcore.Unit.fromFiat(0.001, rate)
```


##### bitcore - units - conversion

```js
'Units', unit.BTC, unit.atRate(rate)
bitcore.Unit.fromMilis(1).toBTC()
bitcore.Unit.fromMilis(1).toSatoshi()
bitcore.Unit.fromSatoshi(1000).toMilis()
```

##### alternative (by hand)

```js
fromBtcToSatoshi = Math.pow(10, 8)
fromSatoshiToBtc = Math.pow(10, -8)

console.log(valueBtc * fromBtcToSatoshi)
```

#### Other notes (implementation, apis)

```js


// blockchain.balance
//
angular.element($0).scope().blockchain.balance("1EQPshDav6oQk9ZKssS3DguPCBwQWA7c59", function(result){ console.log(result.data) })

// blockchain.unspent
//
angular.element($0).scope().blockchain.unspent("1EQPshDav6oQk9ZKssS3DguPCBwQWA7c59").then(function(result){ console.log(result.data.unspent_outputs) })

// blockchain.pushtx
//
angular.element($0).scope().blockchain.pushtx

// bitcoin.proto.generatePrivateKey
//
angular.element($0).scope().bitcoin.generatePrivateKey().toString()

// new bitcoin()

// bitcoin.send
//
angular.element($0).scope().bitcoin.send()

// bitcoin.address
//
angular.element($0).scope().bitcoin.address()

// bitcoin.balance
//
angular.element($0).scope().bitcoin.balance()

// bitcoin.
//
angular.element($0).scope().bitcoin


```
