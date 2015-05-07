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
      this.privateKey = null;
      this.address    = null;

      this._loadFromBackup();
      if ( !this.privateKey || !this.privateKey.toString() ) {
        this._generateKeyPair();
        // optional
        this._saveToBackup();
      }
      return this;
    },

    'address': function address() {

      return this.address;
    },

    // sends [amount] to each address
    'send': function send(amount, addresses) {

      var transaction = this._buildTransaction(amount, addresses);
      return this._broadcastTransaction(transaction); // TODO: callback
    },

    // -- private
    // backup
    '_loadFromBackup': function _loadFromBackup() {

      // TODO: naive way, writes the private key in clear, hash it with a password, use bip38?
      if (this._backupStorage()) {
        // TODO catch exception
        this.privateKey = new bitcore.PrivateKey($window.localStorage.swbPrivateKey);
        this.address = $window.localStorage.swbAddress;
      }
    },

    '_saveToBackup': function _saveToBackup() {

      $window.localStorage.swbPrivateKey = this.privateKey.toString();
      $window.localStorage.swbAddress = this.address;
    },

    '_backupStorage': function _backupStorage() {

      return $window.localStorage.swbPrivateKey;
    },

    // keypair
    '_generateKeyPair': function _generateKeyPair() {

      this.privateKey = new bitcore.PrivateKey();
      this.address = this.privateKey.publicKey.toAddress();
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
      var address = addresses[0];

      console.log('address >>>>', this.address);

      BchainApi.unspent(this.address, function unspent(result) {

        var unspentOutput = result.unspentOutputs[0]; // TODO temporary - takes only the first output!
        // console.log('unspentOutput', unspentOutput)

        var newInput = {
            'address': this.address,
            'txid': unspentOutput.tx_hash_big_endian,
            'scriptPubKey': unspentOutput.script,
            'amount': unspentOutput.value,
            'vout': unspentOutput.tx_output_n
          },
          transaction = this._bitcoreBuildTx(address, amount, newInput),
          txHash = transaction.serialize();

        console.log('new input', newInput);

        BchainApi.pushTx(txHash, function(){
          console.log('Transaction pushed to the bitcoin network!');
        });

      }.bind(this));
    },

    '_bitcoreBuildTx': function _bitcoreBuildTx(address, amount, unspentOutput) {

        return new bitcore.Transaction()
          .from([unspentOutput]) // Feed information about what unspent outputs one can use
          .to(address, amount) // Add an output with the given amount of satoshis
          .change(this.address) // Sets up a change address where the rest of the funds will go
          .sign(this.privateKey); // Signs all the inputs it can
          // .fee(10000)    // maybe
    }
  };

  return Bitcoin;
  }]);
}(angular, require));
