/*global angular nfc ndef*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    var hammeredValue = 's:0?body=';
    return {
      '$get': ['$window', '$log', '$rootScope',
        function providerConstructor($window, $log, $rootScope) {

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
          , onListeningEvent = function onListeningEvent(nfcEvent) {

            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage
              , message = ndefMessage && $window.nfc.bytesToString(ndefMessage[0].payload).substring(3);
            $rootScope.$apply(function doApply(scope) {

              if (message &&
                message.indexOf(hammeredValue) >= 0) {

                var privateKey = message.substr(9, message.length);
                scope.$emit('nfc:status-message', {
                  'privateKey': privateKey
                });
                $log.debug('message: the tag contains: \'' + privateKey + '\'');
              } else {

                scope.$emit('nfc:status-empty');
                $log.debug('message: found an empty tag');
              }
            });
          }
          , registerListeners = function registerListeners() {

            if ($window.nfc) {

              nfc.addNdefListener(onListeningEvent, onInitSuccess, onInitError);
            } else {

              //onInitError('Your are in browser');// rompe il cazzo 4 debugging, re-enable later?
              $log.log('Your are in browser');
            }
          }
          , tmpDoWrite
          , onRemoveError = function onRemoveError(error) {

            $log.log('BOOOM', error);
          }
          , onWriteSuccess = function onWriteSuccess() {

            nfc.removeNdefListener(tmpDoWrite, function onSuccess() {

              $log.log('all ok');
            }, onRemoveError);
            registerListeners();
          }
          , doWrite = function doWrite(payload) {

            var messageToSend = [
              ndef.textRecord(hammeredValue + payload.txt)
            ];
            nfc.write(messageToSend, onWriteSuccess, onRemoveError);
          }
          , onRemoveSucess = function onRemoveSucess(payload) {

            if ($window.nfc) {

              tmpDoWrite = doWrite.bind(undefined, payload);
              nfc.addNdefListener(tmpDoWrite, onInitSuccess, onInitError);
            } else {

              onInitError('Your are in browser');
            }
          }
          , writeTag = function writeTag(txt) {

            nfc.removeNdefListener(onListeningEvent, onRemoveSucess.bind(undefined, payload), onRemoveError);
          };


        $rootScope.$on('system:started', function onSystemStarted() {

          registerListeners();
        });

        return {

          'writeTag': writeTag
        }
      }]
    };
  }]);
}(angular));
