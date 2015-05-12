/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Send.controller', [])
  .controller('SendCtrl', ['$rootScope', '$scope', '$window', '$log', '$stateParams', 'BitCoin', 'CordovaClipboard',
    function SendCtrlController($rootScope, $scope, $window, $log, $stateParams, BitCoin, CordovaClipboard) {

    $scope.publicAddress = BitCoin.address;
    // $scope.toAddress = '1antani';
    $scope.toAddress = '197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY';
    $scope.outputAmount = Number('1000'); // FIXME - use amount from ng-model

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

        BitCoin.send(Number($scope.outputAmount), $scope.toAddress).then(function onSent(response) {

          $log.log('SENT');
          $log.log('response:', response);

          $scope.$apply(function doApply() {

            $scope.sending = undefined;
            $scope.successText = 'Payment sent.';
            $scope.errorText = false;
          });
        }).catch(function onError(error){

          $log.log('catched error', error.message);

          $scope.$apply(function doApply() {

            $scope.errorText = error.message;
            $scope.successText = false;
            $scope.sending = undefined;
          });
        });
      }
    };

    $scope.copyToClipboard = function copyToClipboard() {

      $scope.resetFlags();

      if (!$scope.copyingClipboard) {

        $scope.copyingClipboard = true;
        $scope.copied = false;

        if ($scope.privateKey &&
          $scope.privateKey.toString().match(/^5[HJK][1-9A-Za-z][^OIl]{49}/)) {

          CordovaClipboard.copy($scope.privateKey.toString()).then(function onCopy() {

            $scope.copyingClipboard = false;
            $scope.copied = true;
          }).catch(function onCopyError(error) {

            $log.error('Unable to copy to clipboard', error);
          });
        } else {

          $scope.copyingClipboard = false;
          $scope.copied = false;
          $scope.errorText = 'Private key is not present.';

          $log.error('Private key is not present', $scope.privateKey);
        }
      }
    };

    BitCoin.balance().then(function onBalance(balance) {

      $scope.balance = balance;
    });
  }]);
}(angular));
