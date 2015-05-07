/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    return {
      '$get': ['$window', '$rootScope'
        function providerConstructor($window, $rootScope) {

        var onNFCInitSuccess = function onNFCInitSuccess() {

            $rootScope.$emit('nfc:status-ok');
          }
          , onNFCInitError = function onNFCInitError(error) {

            $rootScope.$emit('nfc:status-ko', {
              'error': error
            });
          }
          , onNFCEvent = function onNFCEvent(nfcEvent) {
            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            $window.alert(JSON.stringify(ndefMessage));

            // assuming the first record in the message has
            // a payload that can be converted to a string.
            $window.alert($window.nfc.bytesToString(ndefMessage[0].payload).substring(3));
          };
        // Read NDEF formatted NFC Tags
        $window.nfc.addNdefListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
      }]
    };
  }]);
}(angular));
