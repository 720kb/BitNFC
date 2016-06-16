# BitNFC (v2!)
Bitcoin NFC Android Mobile Wallet - JS + React + Redux + Cordova + Bitcore + Blockchain.info API + Cordova NFC plugin #nowebpack

Restarted, based on `makevoid/react-redux-rollup-boilerplate`

### Install

Instal npm dependencies

    npm i

    npm i -g rollup

Re-compile (babel):

   rollup -c config/rollup.js


Run with your favourite web server:

    python -m SimpleHTTPServer 3000

Then access <http://localhost:3000>

### Automatic re-rollup + livereload

Setup:

    gem i guard

Run:

    guard

Modify a file and then you should have the build compiled and see the browser reloaded.


### Update bitcoin-api-light browserify vendored bundle

If you need to update the `BitcoinLightClient` bundle, build it up via browserify:

   npm i

Or a specific force-update to bitcoin-api-light itself, then:

   browserify vendor/bitcoin_api_light.js -o vendor/bitcoin_api_light_bundle.js
