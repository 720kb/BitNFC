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

      BitCoin.prototype.sweep = function sweep(privateKeyString) {

        var privateKey = new bitcore.PrivateKey(privateKeyString),
          address = privateKey.toAddress();

        // - got privateKey from nfc tag
        // - send the full amount to this.address (phone, local wallet)


        return new Promise(function deferred(resolve, reject) {

          BlockChain.balance(address).then(function gotBalance(balance){
            var amount = Number(balance);

            $log.log('amount', amount);
            BlockChain.unspent(address.toString()).then(function unspent(result) {
              if (result) {

                $log.log('all unspent', result.data.unspent_outputs);

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

                    amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshisToBtc');

                    unspentOutputsToUse.push({
                      'address': address.toString(),
                      'txid': anUnspentOutput.tx_hash_big_endian,
                      'scriptPubKey': anUnspentOutput.script,
                      'amount': amountBtc,
                      'vout': anUnspentOutput.tx_output_n
                    });
                  }
                }

                if (unspentOutputsToUse.length > 0) {
                  $log.log('unspent output to use', unspentOutputsToUse);

                  // build transaction
                  transaction = new bitcore.Transaction()
                    .from(unspentOutputsToUse)
                    .to(this.address, amount)
                    .change(this.address)
                    .fee(5000)             // 5000 satoshis is a good fee nowadays
                    .sign(privateKey);

                  txHash = transaction.serialize();

                  // push transaction
                  BlockChain.pushTx(txHash).then(function onTransactionFinished() {

                    resolve({
                      'message': 'Sweep done, check your balance!'
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
        }.bind(this));

      };

      BitCoin.prototype.send = function send(amount, addressTo) {

        // - get the unspent outputs
        // - create transaction
        // - push it to the blockchain
        return new Promise(function deferred(resolve, reject) {

          if (!amount ||
            !addressTo) {

            reject({
              'message': 'You need to specify both the address and the amount'
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

                  amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshisToBtc');

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
                  .from(unspentOutputsToUse)
                  .to(addressTo, amount)
                  .change(this.address)
                  .fee(5000)             // 5000 satoshis is a good fee nowadays
                  .sign(this.privateKey);

                txHash = transaction.serialize();

                // push transaction
                BlockChain.pushTx(txHash).then(function onTransactionFinished() {
                  var amountMbtc = $filter('UnitConvert')(amount, 'satoshisToMbtc');

                  resolve({
                    'message': 'You\'ve sent '+amountMbtc+' mBTC to '+addressTo+' !'
                  });
                }.bind(this));
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

      BitCoin.prototype.fromPrivateKey = function fromPrivateKey(privateKey) {

        return new bitcore.PrivateKey(privateKey);
      };

      BitCoin.prototype.balance = function balance() {

        return BlockChain.balance(this.address);
      };

    return new BitCoin();
  }]);
}(angular, require));
