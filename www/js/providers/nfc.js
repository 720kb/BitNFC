/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    var hammeredValue = 'sms:0?body=';
    return {
      '$get': ['$window', '$log', '$rootScope', 'BlockChain', 'BitCoin',
        function providerConstructor($window, $log, $rootScope, BlockChain, BitCoin) {

        var onInitSuccess = function onInitSuccess() {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:status-ok');
            });
          }
          , onInitError = function onInitError(error) {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:status-ko', {
                'error': error
              });
            });
          }
          , onWriteSuccess = function onWriteSuccess() {

            $rootScope.$emit('nfc:write-success');
          }
          , onWriteError = function onWriteError(error) {

            $rootScope.$emit('nfc:write-error', {
              'error': error
            });
          }
          , newPrivateKey = function newPrivateKey(scope) { //Empty tag writing down a private key

              var theNewPrivateKey = BitCoin.generatePrivateKey()
                , theNewPrivateKeyToString = theNewPrivateKey.toString()
                , messageToSend = [
                  $window.ndef.uriRecord(hammeredValue + theNewPrivateKeyToString)
                ];

              $window.nfc.write(messageToSend, onWriteSuccess, onWriteError);
              scope.$emit('nfc:status-empty', {
                'privateKey': theNewPrivateKey
              });
              $log.debug('wrote down on tag ' + theNewPrivateKey.toString() + ' - address: ' + theNewPrivateKey.toAddress().toString());
            }
          , onListeningEvent = function onListeningEvent(nfcEvent) {

            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage
              , message = ndefMessage && $window.nfc.bytesToString(ndefMessage[0].payload).substring(1);
            $rootScope.$apply(function doApply(scope) {

              $log.debug('message: ' + message);
              if (message &&
                message.indexOf(hammeredValue) >= 0) {

                var privateKeyString = message.substr(hammeredValue.length, message.length)
                  , privateKey = BitCoin.fromPrivateKey(privateKeyString)
                  , address = privateKey.toAddress();
                $log.debug('There\'s a tag.');
                BlockChain.balance(address.toString()).then(function onBalance(tagBalance) {
                  $log.debug('Tag balance: ' + tagBalance);

                  if (Number(tagBalance) > 0) {

                    scope.$emit('nfc:status-message', {
                      'privateKey': privateKey,
                      'balance': tagBalance,
                      'address': address
                    });
                    $log.debug('The tag contains: \'' + privateKey + '\'');
                  } else {

                    scope.$emit('nfc:status-balance-empty', {
                      'privateKey': privateKey,
                      'balance': tagBalance,
                      'address': address
                    });
                    // newPrivateKey(scope);
                  }
                });
              } else { //Empty tag writing down a private key

                newPrivateKey(scope);
              }
            });
          }
          , registerListeners = function registerListeners() {

            if ($window.nfc) {

              $window.nfc.addNdefListener(onListeningEvent, onInitSuccess, onInitError);
            } else {

              $log.debug('Your are in browser');
            }
          };

        $rootScope.$on('system:started', function onSystemStarted() {

          registerListeners();
        });
      }]
    };
  }]);
}(angular));
