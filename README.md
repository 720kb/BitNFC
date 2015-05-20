# DogeNFC

<img src="http://mkvd.s3.amazonaws.com/DogeNFC/DogeNFC_Logo_Complete.png" />


### Why Doge

Research (Experience, Science!)
2015 - What is crypto currency is still unkown
London, age 15-30 - happened a bunch of times to be in a group where nobody knows bitcoin and only one knows Doge

This is something we have to research:

![](http://mkvd.s3.amazonaws.com/DogeNFC/DogeNFC_Logo_Doge.png)

Doge plz help


### Download

Download the APK from there it and install it on your Android phone!

https://copy.com/RFU1SLqowCJEra4l


### Install

##### Dowload the APK from the website

#### http://dogenfc.com

Search it on Google Play (soon!)


## Known Bugs

##### 1. After the NFC tag is written, alert the user to stay away from the bug

[There is a bug after you write  the tag, the nfc provider should deregister itself for few seconds]

The problem can be fixed in many ways - see github issues for the full discussion :)

The error happens also on very bad networking, but it's usually a rare occasion.

##### 2. New empty tag > OK (Send) - The focus should happen on the field!

UX problem (now it requires 2 click to select the field, it should automatically .focus() when the [OK] button from the popup has been pressed)

##### 3. Save the phone wallet private key in the device

Save the phone wallet private key in the device, instead that in localStorage (in the app data), otherwise if you uninstall the app, your private key is lost!

##### 4. see github issues for more


Please report as many bugs as you can, we'll try to fix them asap (remember we can't publish a new version until the hackathon is finished)


For other known bugs - see the Github Issues section


### Moar Features

- Better errors > show confirmation count (e.g. in sweep)
- Ability to Copy (Clone the tag) (Backup)
- Settings > Denominations (other than millibits: BTCs, bits)
- Settings > Export private key
- support for other cryptocurrencies
- whitelabel version
- BIP38 version
- HD Wallet version
- embed link to url as other NFC record or dedicated url like bitnfc:// or bitcoin://import/pvtkey
- integrate qr.js library
- scan qr code to send payment
- export private key via SMS !!! <<<< **this is awesome**
- use password protected nfc tokens
- use BIP38 password protected private keys
- embed the link for the app
- copy tag (clone tag)
- you name one!
- many more features!!!

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

![](http://mkvphoto.s3.amazonaws.com/BitNFC/small/sms_copy1.jpg)
![](http://mkvphoto.s3.amazonaws.com/BitNFC/small/sms_copy2.jpg)

on standard Mifare tags usually there is space for another NFC Record

we can also embed a link to the app's google play store page so an user can just scan the nfc tag, click & download :)

## Release

Create a keystore (only the first time):

```keytool -genkey -v -keystore BitNFC.keystore -alias BitNFC -keyalg RSA -keysize 2048 -validity 10000```;

build the project in release mode:

```cordova plugin rm org.apache.cordova.console && cordova build --release android```

sign the two apk generated:

```jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore BitNFC.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC```

use zipaling to slim the apks:

```zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk BitNFC-x86.apk && zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk BitNFC-armv7.apk```


### Unlincensed under #The_Unlicense


enjoy!


#### <http://bitfc.org>
