/*global angular nfc ndef*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    var hammeredValue = 's:0?body=';
    return {
      '$get': ['$window', '$rootScope',
        function providerConstructor($window, $rootScope) {

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
          , tmpDoWrite
          , onRemoveError = function onRemoveError(error) {

            $window.console.log('BOOOM', error);
          }
          , onListeningEvent = function onListeningEvent(nfcEvent) {

            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage
              , message = ndefMessage && $window.nfc.bytesToString(ndefMessage[0].payload).substring(3);
            $rootScope.$apply(function doApply(scope) {

              if (message && message.indexOf(hammeredValue) >= 0) {

                scope.$emit('nfc:status-message', {
                  'privateKey': message.substr(0, 9)
                });
                $window.console.log('message: the tag contains: \'' + message.substr(0, 9) + '\'');
              } else {

                scope.$emit('nfc:status-empty');
                $window.console.log('message: found an empty tag');
              }
            });
          }
          , registerListeners = function registerListeners() {

            if ($window.nfc) {

              nfc.addNdefListener(onListeningEvent, onInitSuccess, onInitError);
            } else {

              //onInitError('Your are in browser');// rompe il cazzo 4 debugging, re-enable later?
              $window.console.log('Your are in browser');
            }
          }
          , onWriteSuccess = function onWriteSuccess() {

            nfc.removeNdefListener(tmpDoWrite, function onSuccess() {

              $window.console.log('all ok');
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
          };


        $rootScope.$on('nfc:write-tag', function onWriteTag(eventsInformations, payload) {

          if (payload &&
            payload.txt) {

            nfc.removeNdefListener(onListeningEvent, onRemoveSucess.bind(undefined, payload), onRemoveError);
          }
        });

        return {
          'registerListeners': registerListeners
        };
      }]
    };
  }]);
}(angular));
