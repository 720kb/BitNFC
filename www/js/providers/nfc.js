/*global angular nfc ndef*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    var hammeredValue = 's:0?body=';
    return {
      '$get': ['$window', '$rootScope',
        function providerConstructor($window, $rootScope) {

        var onNFCInitSuccess = function onNFCInitSuccess() {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:status-ok');
            });
          }
          , onNFCInitError = function onNFCInitError(error) {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:status-ko', {
                'error': error
              });
            });
          }
          , onNFCEvent = function onNFCEvent(nfcEvent) {

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

              nfc.addNdefListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
            } else {

              onNFCInitError('Your are in browser');
            }
          }
          , onNFCWriteSuccess = function onNFCWriteSuccess() {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:write-ok');
            });
            registerListeners();
          }
          , onNFCWriteError = function onNFCWriteError() {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:write-ko');
            });
          }
          , onNFCCallForRemove = function onNFCCallForRemove(payload) {

            var messageToSend = [
              ndef.textRecord(hammeredValue + payload.txt)
            ];
            nfc.write(messageToSend, onNFCWriteSuccess, onNFCWriteError);
          };


        $rootScope.$on('nfc:write-tag', function onWriteTag(eventsInformations, payload) {

          if (payload &&
            payload.txt) {

            nfc.removeNdefListener(onNFCEvent, onNFCCallForRemove.bind(undefined, payload));
          }
        });

        return {
          'registerListeners': registerListeners
        };
      }]
    };
  }]);
}(angular));
