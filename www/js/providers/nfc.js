/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    return {
      '$get': ['$window', '$rootScope',
        function providerConstructor($window, $rootScope) {

        var onNFCInitSuccess = function onNFCInitSuccess() {

            $rootScope.$apply(function doApply(scope) {

              scope.$emit('nfc:status-ok');
              $window.console.log('\r\n\r\nALL OK\r\n\r\n')
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
              , message = $window.nfc.bytesToString(ndefMessage[0].payload).substring(3);

            $rootScope.$apply(function doApply(scope) {
              if (message.indexOf('s:0?body=') >= 0) {
                scope.$emit('nfc:status-message', {
                  'privateKey': message.substr(0, 9)
                });
              } else {

                scope.$emit('nfc:status-empty');
              }
            });

            $window.console.log('message: The NFC tag contains: \'' + message + '\'');
          }
          , registerListeners = function registerListeners() {

            nfc.addNdefListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
            //nfc.addTagDiscoveredListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
            //nfc.addNdefFormatableListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
          };

        return {
          'registerListeners': registerListeners
        };
      }]
    };
  }]);
}(angular));
