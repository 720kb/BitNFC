/*global angular nfc ndef*/
(function withAngular(angular) {
  'use strict';

  angular.module('nfc.provider', [])

  .provider('nfc', [function nfcProvider() {

    var hammeredValue = 'sms:0?body=';
    return {
      '$get': ['$window', '$log', '$rootScope',
        function providerConstructor($window, $log, $rootScope) {

        // var onEraseSuccess = function onEraseSuccess() {
        //
        //     $log.info('Tag erased');
        //   }
        //   , onEraseError = function onEraseError(error) {
        //
        //     $log.error('Tag erasing with error', error);
        //   }
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
              , message = ndefMessage && $window.nfc.bytesToString(ndefMessage[0].payload).substring(1);
            $rootScope.$apply(function doApply(scope) {

              $log.debug('message: ' + message);
              if (message &&
                message.indexOf(hammeredValue) >= 0) {

                var privateKey = message.substr(11, message.length);
                scope.$emit('nfc:status-message', {
                  'privateKey': privateKey
                });
                $log.debug('message: the tag contains: \'' + privateKey + '\'');
                // $window.nfc.erase(onEraseSuccess, onEraseError);
              } else {

                scope.$emit('nfc:status-empty');
                $log.debug('message: found an empty tag');
              }
            });
          }
          , registerListeners = function registerListeners() {

            if ($window.nfc) {

              $window.nfc.addNdefListener(onListeningEvent, onInitSuccess, onInitError);
            } else {

              $log.log('Your are in browser');
            }
          }
          , tmpDoWrite
          , onRemoveError = function onRemoveError(error) {

            $rootScope.$emit('nfc:removal-error', {
              'error': error
            });
          }
          , onWriteSuccess = function onWriteSuccess() {

            $rootScope.$emit('nfc:write-success');
            $window.nfc.removeNdefListener(tmpDoWrite, function onSuccess() {

              registerListeners();
            }, onRemoveError);
          }
          , onWriteError = function onWriteError(error) {

            $rootScope.$emit('nfc:write-error', {
              'error': error
            });
          }
          , doWrite = function doWrite(txt) {

            var messageToSend = [
              ndef.uriRecord(hammeredValue + txt)
            ];
            $window.nfc.write(messageToSend, onWriteSuccess, onWriteError);
            $log.log('Wrote into tag: ' + txt);
          }
          , onRemoveSucess = function onRemoveSucess(txt) {

            if ($window.nfc) {

              tmpDoWrite = doWrite.bind(undefined, txt);
              $window.nfc.addNdefListener(tmpDoWrite, onInitSuccess, onInitError);
            } else {

              $log.log('Your are in browser');
            }
          }
          , writeTag = function writeTag(txt) {

            if ($window.nfc) {

              $window.nfc.removeNdefListener(onListeningEvent, onRemoveSucess.bind(undefined, txt), onRemoveError);
            }
          };


        $rootScope.$on('system:started', function onSystemStarted() {

          registerListeners();
        });

        return {

          'writeTag': writeTag
        };
      }]
    };
  }]);
}(angular));
