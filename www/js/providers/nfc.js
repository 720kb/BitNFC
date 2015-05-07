/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    return {
      '$get': ['$window', '$rootScope',
        function providerConstructor($window, $rootScope) {
          console.log("constructor")

        var onNFCInitSuccess = function onNFCInitSuccess() {

            console.log("status ok")
            $rootScope.$emit('nfc:status-ok');
          }
          , onNFCInitError = function onNFCInitError(error) {

            console.log("status ko")
            $rootScope.$emit('nfc:status-ko', {
              'error': error
            });
          }
          , onNFCEvent = function onNFCEvent(nfcEvent) {
            console.log("status event!!!")
            var tag = nfcEvent.tag
              , ndefMessage = tag.ndefMessage
              , message;

            message = $window.nfc.bytesToString(ndefMessage[0].payload).substring(3)
            console.log("message: The NFC tag contains: '" + message + "'")
            // assuminahg the first record in the message has
            // a payload that can be converted to a string.
            $window.alert(message);
          };


        var time;

        // if (this.state.NFCButtonHasBeenPressed) {
        time = 1000;
        // } else { // in any other state
        // time = 3000;
        // }

        // $rootScope.$emit('nfc:log:martellatona');
        console.log("martellatona")
        setInterval(function(){
          console.log("listener")
          nfc.addNdefListener(onNFCEvent, onNFCInitSuccess, onNFCInitError);
        }.bind(this), 1000)
      }]
    };
  }]);
}(angular));
