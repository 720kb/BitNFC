# BitNFC

<div style="width:50%">

![](http://mkvphoto.s3.amazonaws.com/BitNFC/screen_home2.png)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/screen_receive2.png)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/screen_send.png)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/screen_home2.png)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/screen_wallet_found.png)

</div>



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

![](http://mkvphoto.s3.amazonaws.com/BitNFC/sms_copy1.jpg)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/sms_copy2.jpg)

on standard Mifare tags usually there is space for another NFC Record

we can also embed a link to the app's google play store page so an user can just scan the nfc tag, click & download :) 

-## Release

Create a keystore (only the first time): 

```keytool -genkey -v -keystore BitNFC.keystore -alias BitNFC -keyalg RSA -keysize 2048 -validity 10000```;
 
build the project in release mode: 

```cordova plugin rm org.apache.cordova.console && cordova build --release android```

sign the two apk generated: 

```jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC```

use zipaling to slim the apks: 

```zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC-x86.apk && zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC-armv7.apk```


---

enjoy!

#### Extras

- embed link to url as other NFC record or dedicated url like bitnfc:// or bitcoin://import/pvtkey
- integrate qr.js library
- scan qr code to send payment
- export private key via SMS
- use password protected nfc tokens
- use BIP38 password protected private keys
- embed the link for the app
- copy tag (clone tag)

