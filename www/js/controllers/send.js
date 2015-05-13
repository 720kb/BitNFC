/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Send.controller', [])
  .controller('SendCtrl', ['$rootScope', '$scope', '$window', '$log', '$stateParams', 'BitCoin', 'CordovaClipboard',
    function SendCtrlController($rootScope, $scope, $window, $log, $stateParams, BitCoin, CordovaClipboard) {

    $scope.sendForm = {};
    $scope.publicAddress = BitCoin.address;
    // $scope.sendForm.toAddress = '1antani';
    // $scope.sendForm.toAddress = '197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY';
    // $scope.sendForm.outputAmount = Number('1000'); // FIXME - use amount from ng-model

    $scope.resetFlags = function resetLayoutFlags() {

      $scope.errorText = undefined;
      $scope.successText = undefined;
    };

    $scope.sendBtc = function sendBtc() {

      if (!$scope.sending) {

        $scope.resetFlags();
        $scope.sending = true;

        $log.log('amount: ' + Number($scope.sendForm.outputAmount) + ', address: ' + $scope.sendForm.toAddress);

        BitCoin.send(Number($scope.sendForm.outputAmount), $scope.sendForm.toAddress).then(function onSent(response) {

          $log.log('SENT');
          $log.log('response: ' + response);

          $scope.sending = undefined;
          $scope.successText = 'Payment sent.';
          $scope.errorText = false;
        }).catch(function onError(error){

          $log.log('catched error: ' + error.message);

          $scope.errorText = error.message;
          $scope.successText = false;
          $scope.sending = undefined;
        });
      }
    };

    $scope.copyFromClipboard = function copyFromClipboard() {

      $scope.resetFlags();
      $scope.copied = false;

      CordovaClipboard.paste().then(function onPaste(clipboardText) {

        if (clipboardText &&
          clipboardText.match(/^[13][^O0Il]{25,33}/)) {

          $scope.sendForm.toAddress = clipboardText;
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
