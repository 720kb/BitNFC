/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC.controllers', [])
  .controller('DebugCtrl', ['$rootScope', '$scope',
    function DebugCtrlController($rootScope, $scope) {

      $scope.nfcEmpty = function TriggerNfcEmpty() {

        $rootScope.$emit('nfc:status-empty');
      };

      $scope.nfcMessage = function TriggerNfcMessage() {

        $rootScope.$emit('nfc:status-message');
      };
  }])
  .controller('HomeCtrl', ['$rootScope', '$scope', 'BitCoin',
    function HomeCtrlController($rootScope, $scope, BitCoin) {

      var onBitcoinBalance;

      $scope.publicAddress = BitCoin.address;
      BitCoin.balance; // should be a method (used also in sendctrl)
      onBitcoinBalance = $rootScope.$on('bitcoin:balance', function OnBitcoinBalanceEvent(eventInfo, balance){

        $scope.balance = balance;
      });

      $scope.$on('$destroy', function () {

        onBitcoinBalance();
      });
  }])
  .controller('SettingsCtrl', ['$window', '$scope', 'BitCoin', 'BlockChain', 'Config',
    function SettingsCtrlController($window, $scope, BitCoin, BlockChain, Config) {

      $scope.bitcoin = BitCoin;
      $scope.blockchain = BlockChain;
      $scope.denominations = Config.denominations;
      $scope.currencies = Config.currencies;

      $scope.setDefaultSettings = function setDefaultSettings() {

        $scope.settingsCurrency = 'BTC';
        $scope.settingsDenomination = 'mBTC';
        $window.localStorage.settingsCurrency = $scope.settingsCurrency;
        $window.localStorage.settingsDenomination = $scope.settingsDenomination;
      };

      $scope.setCurrency = function setCurrency() {

        $window.localStorage.settingsCurrency = $scope.settingsCurrency;
      };

      $scope.setDenomination = function setCurrency() {

        $window.localStorage.settingsDenomination = $scope.settingsDenomination;
      };

      $scope.setDefaultSettings();
  }])
  .controller('ReceiveCtrl', ['$scope', 'BitCoin',
    function ReceiveCtrlController($scope, BitCoin) {

      $scope.publicAddress = BitCoin.address;
  }])
  .controller('SendCtrl', ['$rootScope', '$scope', '$window', '$log', '$stateParams', 'BitCoin', 'CordovaClipboard',
    function SendCtrlController($rootScope, $scope, $window, $log, $stateParams, BitCoin, CordovaClipboard) {

    var onBitcoinBalance;
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

        BitCoin.send(Number($scope.outputAmount), $scope.toAddress).then(function(response){

          $log.log('SENT');
          $log.log('response:', response);

          $scope.$apply(function () {

            $scope.sending = undefined;
            $scope.successText = 'Payment sent.';
            $scope.errorText = false;
          });
        }).catch(function(error){

          $log.log('catched error', error.message);

          $scope.$apply(function () {

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

          CordovaClipboard.copy($scope.privateKey.toString()).then(function () {

            $scope.copyingClipboard = false;
            $scope.copied = true;
          }).catch(function (error) {

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

    // balance
    BitCoin.balance;

    onBitcoinBalance = $rootScope.$on('bitcoin:balance', function OnBitcoinBalanceEvent(eventInfo, balance){

      $scope.balance = balance;
    });

    $scope.$on('$destroy', function () {

      onBitcoinBalance();
    });
  }])
  .controller('SweepCtrl', ['$scope', '$stateParams',
    function SweepCtrlController($scope, $stateParams) {

      $scope.params = $stateParams;

  }]);
}(angular));
