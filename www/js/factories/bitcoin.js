/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('BitCoin.factory', [])

  .factory('BitCoin', ['$window', '$rootScope', '$log', '$q', '$filter', 'BlockChain',
    function BitCoinFactory($window, $rootScope, $log, $q, $filter, BlockChain) {

      var bitcore = require('bitcore')

      // Bitcoin
      //   bitcoin wallet
      //
      // - based on bitcore
      // - localstorage (saves keys locally in the browser)
      // - reveal private key
      // - one-to-many transaction TODO one input, many outputs
      //
      // TODO import bitcoin private key
      , BitCoin = function BitCoin() {
      };

      Object.defineProperties(BitCoin.prototype, {
        'privateKey': {
          'get': function privateKey() {

            if ($window.localStorage.bitNfcPrivateKey) {

              return new bitcore.PrivateKey($window.localStorage.bitNfcPrivateKey);
            }

            var newPrivateKey = new bitcore.PrivateKey();
            $window.localStorage.bitNfcPrivateKey = newPrivateKey.toString();
            return newPrivateKey;
          }
        },
        'address': {
          'get': function address() {

            return this.privateKey.publicKey.toAddress();
          }
        }
      });

      BitCoin.prototype.sweep = function sweep(privateKey) {
        // addressFrom == privateKey.toAddress().toString()
        // addressTo == this.address
        $log.log('privateKey', privateKey);
      };

      BitCoin.prototype.send = function send(amount, addressTo) {

        // - get the unspent outputs
        // - create transaction
        // - push it to the blockchain
        return new Promise(function deferred(resolve, reject) {

          if (!amount ||
            !addressTo) {

            reject({
              'message': 'mandatory fileds missing [amount] and/or [addressTo]'
            });
          }

          // get the unspent outputs
          BlockChain.unspent(this.address.toString()).then(function unspent(result) {
            $log.log('all unspent', result);
            if (result) {

              var unspentOutputsIndex = 0
                , unspentOutputsLength = result.data.unspent_outputs.length
                , anUnspentOutput
                , partialAmount = 0
                , unspentOutputsToUse = []
                , transaction
                , txHash
                , amountBtc;
              for (; unspentOutputsIndex < unspentOutputsLength; unspentOutputsIndex += 1) {

                anUnspentOutput = result.data.unspent_outputs[unspentOutputsIndex];
                if (anUnspentOutput &&
                  anUnspentOutput.value &&
                  partialAmount <= amount) {

                  partialAmount += anUnspentOutput.value;

                  amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshiToBtc');

                  unspentOutputsToUse.push({
                    'address': this.address.toString(),
                    'txid': anUnspentOutput.tx_hash_big_endian,
                    'scriptPubKey': anUnspentOutput.script,
                    'amount': amountBtc,
                    'vout': anUnspentOutput.tx_output_n
                  });
                }
              }

              if (unspentOutputsToUse.length > 0) {

                // build transaction
                transaction = new bitcore.Transaction()
                  .from(unspentOutputsToUse) // Feed information about what unspent outputs one can use
                  .to(addressTo, amount) // Add an output with the given amount of satoshis
                  .change(this.address) // Sets up a change address where the rest of the funds will go
                  .fee(5000)
                  .sign(this.privateKey); // Signs all the inputs it can

                  $log.log('serialized tx', transaction.serialize());


                // if (fee) {
                //   transaction.fee(fee);
                // }
                txHash = transaction.serialize();

                // push transaction
                BlockChain.pushTx(txHash).then(function onTransactionFinished() {

                  resolve({
                    'message': 'Transaction done!'
                  });
                });
              } else {

                reject({
                  'message': 'Not enough unspent outputs'
                });
              }
            } else {

              reject({
                'message': 'No unspent output for address'
              });
            }
          }.bind(this));
        }.bind(this));
      };

      BitCoin.prototype.generatePrivateKey = function generatePrivateKey() {

        return new bitcore.PrivateKey();
      };

      BitCoin.prototype.balance = function balance() {

        return BlockChain.balance(this.address);
      };

    return new BitCoin();
  }]);
}(angular, require));
