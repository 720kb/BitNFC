/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('BitCoin.factory', [])

  .factory('BitCoin', ['$window', '$rootScope', '$filter', 'BlockChain',
    function BitCoinFactory($window, $rootScope, $filter, BlockChain) {

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

            var address = this.privateKey.toAddress();;
            $window.localStorage.bitNfcAddress = address;
            return address;
          }
        },
        'balance': {
          'get': function balance() {
            BlockChain.balance(this.address, function(result){
              $rootScope.$emit('bitcoin:balance', result.data);
            });
          }
        }
      });

      BitCoin.prototype.sweep = function sweep(privateKey, fee) {
        // addressFrom == privateKey.toAddress().toString()
        // addressTo == this.address
      };

      BitCoin.prototype.send = function send(amount, addressTo, fee) {

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

          console.log("address owner of unspent", this.address)
          // get the unspent outputs
          BlockChain.unspent(this.address.toString()).then(function unspent(result) {
            console.log("all unspent", result)
            if (result) {

              var unspentOutputsIndex = 0
                , unspentOutputsLength = result.data.unspent_outputs.length
                , anUnspentOutput
                , partialAmount = 0
                , unspentOutputsToUse = []
                , transaction
                , txHash;
              for (; unspentOutputsIndex < unspentOutputsLength; unspentOutputsIndex += 1) {

                anUnspentOutput = result.data.unspent_outputs[unspentOutputsIndex];
                if (anUnspentOutput &&
                  anUnspentOutput.value &&
                  partialAmount <= amount) {

                  partialAmount += anUnspentOutput.value;

                  var amountBtc = $filter('UnitConvert')(anUnspentOutput.value, 'satoshiToBtc')

                  // ({"address":"12uepmgZN5rULEjTa6N363S3fNYFi5NQs6","txid":"32e64708cebb9c6cd491cddaf2be957ff1501a9562c6822b6aecf3c659383414","vout":0,"scriptPubKey":"76a91414ed5451a524f969316a64d49a95dee1df7962aa88ac","amount":0.005})

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

                console.log("first unspent output - ovvero this tx input - amount:", unspentOutputsToUse[0].amount)
                console.log("output amount:", amount)
                console.log("pvt key", this.privateKey.toString())


                // build transaction
                transaction = new bitcore.Transaction()
                  .from(unspentOutputsToUse) // Feed information about what unspent outputs one can use
                  .to(addressTo, amount) // Add an output with the given amount of satoshis
                  .change(this.address) // Sets up a change address where the rest of the funds will go
                  .fee(5000)
                  .sign(this.privateKey); // Signs all the inputs it can

                  // 53ae0701c2f57fb454af09491069ad912c989310bf180d0e0961671aefc9f395

                  console.log("utxos to use as inputs", unspentOutputsToUse)

                  // var transaction = new bitcore.Transaction()
                  //

//                   address: "197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY"
// amount: 0.00001
// scriptPubKey: "76a91414ed5451a524f969316a64d49a95dee1df7962aa88ac"
// txid: "32e64708cebb9c6cd491cddaf2be957ff1501a9562c6822b6aecf3c659383414"
// vout: 0
                  //  .from({"address":"12uepmgZN5rULEjTa6N363S3fNYFi5NQs6","txid":"32e64708cebb9c6cd491cddaf2be957ff1501a9562c6822b6aecf3c659383414","vout":0,"scriptPubKey":"76a91414ed5451a524f969316a64d49a95dee1df7962aa88ac","amount":0.005})


                  //   .to('197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY', 10000)
                  //   .sign('53ae0701c2f57fb454af09491069ad912c989310bf180d0e0961671aefc9f395')

                  console.log("serialized tx", transaction.serialize())


                // if (fee) {
                //   transaction.fee(fee);
                // }
                txHash = transaction.serialize();

                // push transaction
                BlockChain.pushTx(txHash).then(function onTransactionFinished() {

                  resolve({
                    'message': 'Transaction done! whohooo!'
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

    return new BitCoin();
  }]);
}(angular, require));
