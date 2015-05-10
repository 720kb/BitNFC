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
  .controller('SendCtrl', ['$rootScope','$scope', '$stateParams', 'BitCoin',
    function SendCtrlController($rootScope, $scope, $stateParams, BitCoin) {

    var onBitcoinBalance;
    $scope.publicAddress = BitCoin.address;
    $scope.sending = false;
    // $scope.toAddress = '1antani';
    $scope.toAddress = '197GxXSqqSAkhLXyy9XrtEySvssuDcQGMY';

    $scope.outputAmount = Number('1000'); // FIXME - use amount from ng-model

    $scope.sendBtc = function () {
      if (!$scope.sending) {
        $scope.sending = true;


        BitCoin.send(Number($scope.outputAmount), $scope.toAddress).then(function(response){
          console.log("SENT");
          console.log("response:", response);
          $scope.sending = false;
          $scope.sentMessage = 'Payment sent!';
        }).catch(function(error){
          console.log("catched error", error.message);
          $scope.errorMessage = error.message;
          $scope.sending = false;
        });
      }
    };

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey
      });
    }

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
