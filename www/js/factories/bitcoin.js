/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('BitCoin.factory', [])

  .factory('BitCoin', ['$window', 'BlockChain',
    function BitCoinFactory($window, BlockChain) {

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

        if (!$window.localStorage.bitNFC) {

          $window.localStorage.bitNFC = {};
        }
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

            if ($window.localStorage.bitNfcAddress) {

              return bitcore.Address($window.localStorage.bitNfcAddress);
            }

            var address = this.privateKey.publicKey.toAddress();
            $window.localStorage.bitNfcAddress = address;
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

          BlockChain.unspent(this.address).then(function unspent(result) {

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
                BlockChain.pushTx(txHash).then(function onTransactionFinished() {

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

      BitCoin.prototype.generatePrivateKey = function generatePrivateKey() {

        return new bitcore.PrivateKey();
      };

    return new BitCoin();
  }]);
}(angular, require));
