# BitNFC


### NFC Format SMS (the only one that is copy-pastable)

Record NFC

```
s:0?body=5privateKey
```

on standard Mifare tags usually there is space for another NFC Record

you could embed a link


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

// bitcoin.
//
angular.element($0).scope().bitcoin

// bitcoin.
//
angular.element($0).scope().bitcoin

```
