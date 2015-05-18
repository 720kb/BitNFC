# BitNFC

[screenshots]


### Download

<apk link>

### Install

TODO

### Moar Features

- Better errors > show confirmation count (e.g. in sweep)
- Ability to Copy (Clone the tag) (Backup)
- Settings > Denominations (other than millibits: BTCs, bits)
- Settings > Export private key

## Development

### Prerequisites

You need Android Studio SDK with SDK v.22

### Install

download the project (or git clone it)

enter the dir

```sh
npm install cordova ionic -g

npm install && bower install && ionic state reset

ionic run android # to run it on device (or simulator)

```

or

```sh
ionic serve # to run it locally on a browser (of course NFC will not work)
```

## Release

1. create a keystore (only the first time): ```keytool -genkey -v -keystore BitNFC.keystore -alias BitNFC -keyalg RSA -keysize 2048 -validity 10000```;
2. build the project in release mode: ```cordova plugin rm org.apache.cordova.console && cordova build --release android```;
3. sign the two apk generated: ```jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC```;
4. use zipaling to slim the apks: ```zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC-x86.apk && zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC-armv7.apk```.

### NFC Format SMS (the only one that is copy-pastable)

This is the format we are using to encode the tag with:

(we chose sms url)

```
sms:0?body=privateKey
```

It's actually an SMS format:

Does it resemble something?

```
mailto:user@example.com
```

it's:

```
sms:URL
```

that like an url has variables

```
sms:path/?var=foo
```

on standard Mifare tags usually there is space for another NFC Record

you could embed a link


---

notes:

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

### Extras - TODO

- embed link to url as other NFC record or dedicated url like bitnfc:// or bitcoin://import/pvtkey
- integrate qr.js library
- scan qr code to send payment
- export private key via SMS
- use password protected nfc tokens
- use BIP38 password protected private keys
- embed the link for the app
- copy tag (clone tag)





#### Other notes (implementation, debug apis)


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


----


screencast


adb shell screenrecord --bit-rate 8000000 /sdcard/test/sr1.mp4
adb shell screenrecord --bit-rate 8000000 /sdcard/test/sr2.mp4
adb shell screenrecord --bit-rate 8000000 /sdcard/test/sr3.mp4
adb shell screenrecord --bit-rate 8000000 /sdcard/test/sr4.mp4
adb shell screenrecord --bit-rate 8000000 /sdcard/test/sr5.mp4
