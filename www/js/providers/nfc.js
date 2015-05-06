/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    return {
      '$get': ['$window',
        function providerConstructor($window) {

        // Read NDEF formatted NFC Tags
        $window.nfc.addNdefListener(
          function onNFCEvent(nfcEvent) {
            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            $window.alert(JSON.stringify(ndefMessage));

            // assuming the first record in the message has
            // a payload that can be converted to a string.
            $window.alert($window.nfc.bytesToString(ndefMessage[0].payload).substring(3));
          },
          function onSuccessNFCInit() { // success callback
            $window.alert('Waiting for NDEF tag');
          },
          function OnErrorNFCInit(error) { // error callback
            $window.alert('Error adding NDEF listener ' + JSON.stringify(error));
          }
        );
      }]
    };
  }]);
}(angular));
