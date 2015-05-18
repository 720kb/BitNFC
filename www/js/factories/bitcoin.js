/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('BitCoin.factory', [])

  .factory('BitCoin', ['$window', '$rootScope', '$log', '$q', '$http', '$filter', '$cacheFactory', 'BlockChain',
    function BitCoinFactory($window, $rootScope, $log, $q, $http, $filter, $cacheFactory, BlockChain) {

      var bitcore = require('bitcore')
        , ratesCache = $cacheFactory('cacheId')
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

            $log.debug('amount', amount);
            BlockChain.unspent(address.toString()).then(function unspent(result) {
              if (result) {

                var unspentOutputsIndex = 0
                  , unspentOutputsLength = result.data.unspent_outputs.length
                  , anUnspentOutput
                  , unspentOutputsToUse = []
                  , transaction
                  , txHash
                  , amountBtc
                  , fee = 5500;
                for (; unspentOutputsIndex < unspentOutputsLength; unspentOutputsIndex += 1) {
                  anUnspentOutput = result.data.unspent_outputs[unspentOutputsIndex];
                  amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshisToBtc');

                  unspentOutputsToUse.push({
                    'address': address.toString(),
                    'txid': anUnspentOutput.tx_hash_big_endian,
                    'scriptPubKey': anUnspentOutput.script,
                    'amount': amountBtc,
                    'vout': anUnspentOutput.tx_output_n
                  });
                }

                if (unspentOutputsToUse.length > 0) {
                  $log.debug('unspent output to use ' + unspentOutputsToUse);

                  // build transaction
                  transaction = new bitcore.Transaction()
                    .from(unspentOutputsToUse)
                    .to(this.address, amount - fee)
                    .change(this.address)  // not needed
                    .fee(fee)             // 5000 satoshis is a good fee nowadays
                    .sign(privateKey);

                  $log.debug('transaction:');
                  $log.debug(JSON.stringify(transaction));

                  try {

                    txHash = transaction.serialize();
                  } catch(error) {

                    reject({
                      'message': 'Error serializing the transaction: ' + error.message
                    });
                  }

                  if (txHash) {

                    // push transaction
                    BlockChain.pushTx(txHash).then(function onTransactionFinished() {

                      resolve({
                        'message': 'Sweep done, check your balance!'
                      });
                    }).catch(function onError(error){
                      $log.debug('pushtx error: ' + error.data);

                      reject({
                        'message': 'Error pushing the transaction: ' + error.data
                      });
                    });
                  }
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
            $log.debug('all unspent' + JSON.stringify(result.data.unspent_outputs));
            if (result) {

              var unspentOutputsIndex = 0
                , unspentOutputsLength = result.data.unspent_outputs.length
                , anUnspentOutput
                , unspentOutputsToUse = []
                , transaction
                , txHash
                , amountBtc;
              for (; unspentOutputsIndex < unspentOutputsLength; unspentOutputsIndex += 1) {
                anUnspentOutput = result.data.unspent_outputs[unspentOutputsIndex];
                amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshisToBtc');

                unspentOutputsToUse.push({
                  'address': this.address.toString(),
                  'txid': anUnspentOutput.tx_hash_big_endian,
                  'scriptPubKey': anUnspentOutput.script,
                  'amount': amountBtc,
                  'vout': anUnspentOutput.tx_output_n
                });
              }

              if (unspentOutputsToUse.length > 0) {

                // build transaction
                transaction = new bitcore.Transaction()
                  .from(unspentOutputsToUse)
                  .to(addressTo, amount)
                  .change(this.address)
                  .fee(5500)             // 5000 satoshis is a good fee nowadays
                  .sign(this.privateKey);

                try {

                  txHash = transaction.serialize();
                } catch(error) {

                  reject({
                    'message': 'Error serializing the transaction: ' + error.message
                  });
                }

                if (txHash) {

                  // push transaction
                  BlockChain.pushTx(txHash).then(function onTransactionFinished() {
                    var amountMbtc = $filter('UnitConvert')(amount, 'satoshisToMbtc');

                    resolve({
                      'message': 'You\'ve sent ' + amountMbtc + ' mBTC to ' + addressTo + ' !'
                    });
                  }).catch(function onError(error){

                    reject({
                      'message': 'Error pushing the transaction: ' + error.data
                    });
                  });
                }
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
          }.bind(this)).catch(function onError(/*error*/) {

            reject({
              'message': 'Unspent output request failed - address or amount are malformed'
            });
          });
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

      BitCoin.prototype.toCurrency = function toCurrency(amount, currentCurrency) {

        return $q(function deferred(resolve, reject) {

          var conversions
            , conversionsLength
            , conversionsIndex = 0
            , aConversion
            , theActualRate;
          if (!ratesCache.get('conversions')) {

            $http({
              'method': 'GET',
              'url': 'https://bitpay.com/api/rates'
            }).then(function onSuccess(response) {

              if (response &&
                response.data) {

                conversions = response.data;
                conversionsLength = conversions.length;
                ratesCache.put('conversions', conversions);
                for (; conversionsIndex < conversionsLength; conversionsIndex += 1) {

                  aConversion = conversions[conversionsIndex];
                  if (aConversion &&
                    aConversion.code === currentCurrency) {

                    theActualRate = aConversion.rate;
                  }
                }

                resolve(bitcore.Unit.fromSatoshis(amount).atRate(theActualRate));
              }
            }, function onFailure(failure) {

              reject(failure);
            });
          } else {

            conversions = ratesCache.get('conversions');
            conversionsLength = conversions.length;
            for (; conversionsIndex < conversionsLength; conversionsIndex += 1) {

              aConversion = conversions[conversionsIndex];
              if (aConversion &&
                aConversion.code === currentCurrency) {

                theActualRate = aConversion.rate;
              }
            }

            resolve(bitcore.Unit.fromSatoshis(amount).atRate(theActualRate));
          }
        });
      };

    return new BitCoin();
  }]);
}(angular, require));
