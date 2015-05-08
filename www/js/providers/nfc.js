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
            console.log('status event!!!')
            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage
              , message = $window.nfc.bytesToString(ndefMessage[0].payload).substring(3);
            console.log('message: The NFC tag contains: \'' + message + '\'');
            // assuminahg the first record in the message has
            // a payload that can be converted to a string.
            $window.alert(message);
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
