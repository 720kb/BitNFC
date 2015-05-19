# BitNFC

[screenshots]


notes moved in Notes.md

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

on standard Mifare tags usually there is space for another NFC Record

you could embed a link

