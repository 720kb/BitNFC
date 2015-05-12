/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Send.controller', [])
  .controller('SendCtrl', ['$rootScope', '$scope', '$window', '$log', '$stateParams', 'BitCoin', 'CordovaClipboard',
    function SendCtrlController($rootScope, $scope, $window, $log, $stateParams, BitCoin, CordovaClipboard) {

    $scope.publicAddress = BitCoin.address;
    // $scope.toAddress = '1antani';
    // $scope.toAddress = '197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY';
    // $scope.outputAmount = Number('1000'); // FIXME - use amount from ng-model

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey
      });
    }

    $scope.resetFlags = function resetLayoutFlags() {

      $scope.errorText = undefined;
      $scope.successText = undefined;
    };

    $scope.sendBtc = function sendBtc() {

      if (!$scope.sending) {

        $scope.resetFlags();
        $scope.sending = true;

        $log.log("amount: " + Number($scope.outputAmount) + ", address: " + $scope.toAddress)

        BitCoin.send(Number($scope.outputAmount), $scope.toAddress).then(function onSent(response) {

          $log.log('SENT');
          $log.log('response: ' + response);

          $scope.$apply(function doApply() {

            $scope.sending = undefined;
            $scope.successText = 'Payment sent.';
            $scope.errorText = false;
          });
        }).catch(function onError(error){

          $log.log('catched error: ' + error.message);

          $scope.$apply(function doApply() {

            $scope.errorText = error.message;
            $scope.successText = false;
            $scope.sending = undefined;
          });
        });
      }
    };

    $scope.copyFromClipboard = function copyFromClipboard() {

      $scope.resetFlags();
      $scope.copied = false;

      CordovaClipboard.paste().then(function onPaste(clipboardText) {

        if (clipboardText &&
          clipboardText.match(/^[13][^O0Il]{25,33}/)) {

          $scope.toAddress = clipboardText;
          $scope.copied = true;
        } else {

          $scope.copied = false;
          $scope.errorText = 'Clipboard doesn\'t cointain an address.';
          $log.error('Clipboard doesn\'t cointain an address.');
        }

      }).catch(function onCopyError(error) {

        $log.error('Unable to copy to clipboard', error);
      });

    };

    BitCoin.balance().then(function onBalance(balance) {

      $scope.balance = balance;
    });
  }]);
}(angular));
