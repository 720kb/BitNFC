/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('bitcore.factory', [])

  .factory('BitCoin', ['$window',
    function BitCoinFactory($window) {

    var bitcore = require('bitcore')
      , BchainApi = require('blockchain-api-basic')
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

        if (!$window.localStorage.bitNFC) {

          $window.localStorage.bitNFC = {};
        }
      };

      Object.defineProperties(BitCoin.prototype, {
        'privateKey': {
          'get': function privateKey() {

            if ($window.localStorage.bitNFC.privateKey) {

              return new bitcore.PrivateKey($window.localStorage.bitNFC.privateKey);
            }

            var newPrivateKey = new bitcore.PrivateKey();
            $window.localStorage.bitNFC.privateKey = newPrivateKey.toString();
            return newPrivateKey;
          }
        },
        'address': {
          'get': function privateKey() {

            if ($window.localStorage.bitNFC.address) {

              return $window.localStorage.bitNFC.address;
            }

            var address = this.privateKey.publicKey.toAddress();
            $window.localStorage.bitNFC.address = address;
            return address;
          }
        }
      });

      BitCoin.prototype.send = function send(amount, address, fee) {

        return new Promise(function deferred(resolve, reject) {

          if (!amount ||
            !address) {

            reject({
              'message': 'mandatory fileds missing [amount] and [address]'
            });
          }

          BchainApi.unspent(this.address, function unspent(result) {

            if (result) {

              var unspentOutputsIndex = 0
                , unspentOutputsLength = result.unspentOutputs.length
                , anUnspentOutput
                , partialAmount = 0
                , unspentOutputsToUse = []
                , transaction
                , txHash;
              for (; unspentOutputsIndex < unspentOutputsLength; unspentOutputsIndex += 1) {

                anUnspentOutput = result.unspentOutputs[unspentOutputsIndex];
                if (anUnspentOutput &&
                  anUnspentOutput.value &&
                  partialAmount >= amount) {

                  partialAmount += anUnspentOutput.value;
                  unspentOutputsToUse.push({
                    'address': this.address,
                    'txid': anUnspentOutput.tx_hash_big_endian,
                    'scriptPubKey': anUnspentOutput.script,
                    'amount': anUnspentOutput.value,
                    'vout': anUnspentOutput.tx_output_n
                  });
                }
              }

              if (unspentOutputsToUse.length > 0) {

                transaction = new bitcore.Transaction()
                  .from(unspentOutputsToUse) // Feed information about what unspent outputs one can use
                  .to(address, amount) // Add an output with the given amount of satoshis
                  .change(this.address) // Sets up a change address where the rest of the funds will go
                  .sign(this.privateKey); // Signs all the inputs it can

                if (fee) {

                  transaction.fee(fee);
                }
                txHash = transaction.serialize();
                BchainApi.pushTx(txHash, function onTransactionFinished() {

                  resolve({
                    'message': 'Transaction done'
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
          });
        });
      };

    return new BitCoin();
  }]);
}(angular, require));
