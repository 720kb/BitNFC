/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('bitcore.factory', [])

  .factory('BitCoin', ['$window',
    function BitCoinFactory($window) {

    var bitcore = require('bitcore')
      , BchainApi = require('blockchain-api-basic');

    // Bitcoin
    //   bitcoin wallet
    //
    // - based on bitcore
    // - localstorage (saves keys locally in the browser)
    // - reveal private key
    // - one-to-many transaction TODO one input, many outputs
    //

    // TODO import bitcoin private key

  var Bitcoin = {
    'init': function init() {
      this.privateKey = null
      this.address    = null

      this._loadFromBackup()
      if ( !this.privateKey || !this.privateKey.toString() ) {
        this._generateKeyPair()
        // optional
        this._saveToBackup()
      }
      return this
    },

    'address': function address() {

      return this.address;
    },

    // sends [amount] to each address
    'send': function send(amount, addresses) {

      var transaction = this._buildTransaction(amount, addresses)
      return this._broadcastTransaction(transaction) // TODO: callback?
    },

    // -- private
    // backup
    '_loadFromBackup': function _loadFromBackup() {

      // TODO: naive way, writes the private key in clear, hash it with a password, use bip38?
      if (this._backupStorage()) {
        // TODO catch exception
        this.privateKey = new bitcore.PrivateKey($window.localStorage.swb_privateKey)
        this.address = $window.localStorage.swb_address
      }
    },

    '_saveToBackup': function _saveToBackup() {

      $window.localStorage.swb_privateKey = this.privateKey.toString()
      $window.localStorage.swb_address = this.address
    },

    '_backupStorage': function _backupStorage() {

      return $window.localStorage.swb_privateKey
    },

    // keypair
    '_generateKeyPair': function _generateKeyPair() {

      this.privateKey = new bitcore.PrivateKey()
      this.address = this.privateKey.publicKey.toAddress()
    },

    // query for unspent outputs
    '_unspentOutputs': function _unspentOutputs() {

      return BchainApi.unspent(address);
    },

    '_signTransaction': function _signTransaction() {

      //TODO: something?
    },

    '_broadcastTransaction': function _broadcastTransaction(/*transaction*/) {

      /*transaction // ...*/
    },

    '_buildTransaction': function _buildTransaction(amount, addresses) {

      // TODO: right now sends [amount] only to the first address

      var minimum_non_dust_amount = 5431 // .fee(minimum_non_dust_amount)
        , address = addresses[0]

      console.log('address >>>>', this.address)

      BchainApi.unspent(this.address, function unspent(result) {

        // console.log('unspent', result) // => Object { unspent_outputs: Array[1] }
        var unspent_output = result.unspent_outputs[0] // TODO FIXME temporary!
        console.log('unspent_output', unspent_output)

        var new_input = {
          'address': this.address,
          'txid': unspent_output.tx_hash_big_endian,
          'scriptPubKey': unspent_output.script,
          'amount': unspent_output.value,
          'vout': unspent_output.tx_output_n,
        }

        console.log('new input', new_input)

        // outputIndex:  unspent_output.tx_index,

        //   'address':'17SEdNskTNiDxEbkRj87g6jacicKEw7Jot',
        //   'txid':'197d0dc379356343f0e77713e8d41372b1db451b265cd916fed5662464562d22',
        //   'vout':0,
        //   'scriptPubKey':'76a91446968776ae88c81c5a2459f51e1f0d05b1c02d4388ac',
        //   'amount':0.003
        // })

        // TODO: unspent_outputs
        var transaction = this._bitcoreBuildTx(address, amount, new_input)
        var tx_hash = transaction.serialize()

        BchainApi.pushTx(tx_hash, function(){
          console.log('BIG PUSH!!!!')
          console.log('Transaction pushed to the bitcoin network!')
        })

        // var transaction = new bitcore.Transaction()
        // .from({'address':'17SEdNskTNiDxEbkRj87g6jacicKEw7Jot','txid':'197d0dc379356343f0e77713e8d41372b1db451b265cd916fed5662464562d22','vout':0,'scriptPubKey':'76a91446968776ae88c81c5a2459f51e1f0d05b1c02d4388ac','amount':0.003})
        // .to('19e2eU15xKbM9pyDwjFsBJFaSeKoDxp8YT', 10000)
        // .change('17SEdNskTNiDxEbkRj87g6jacicKEw7Jot')
        // .sign('PVT_KEY')

        // .serialize()

        // send ->>>>

        // https://blockchain.info/pushtx
        // { tx: '{}' }
      }.bind(this))
    },

    '_bitcoreBuildTx': function _bitcoreBuildTx(address, amount, unspent_output) {

        return new bitcore.Transaction()
          .from([unspent_output]) // Feed information about what unspent outputs one can use
          .to(address, amount) // Add an output with the given amount of satoshis
          .change(this.address) // Sets up a change address where the rest of the funds will go
          .sign(this.privateKey); // Signs all the inputs it can
          // .fee(10000)    // maybe
    }
  };

  return Bitcoin;
  }]);
}(angular, require));
