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
  .controller('HomeCtrl', ['$scope', 'BitCoin',
    function HomeCtrlController($scope, BitCoin) {

      $scope.publicAddress = BitCoin.address;
  }])
  .controller('SettingsCtrl', ['$scope', 'BitCoin', 'BlockChain',
    function SettingsCtrlController($scope, BitCoin, BlockChain) {

      $scope.bitcoin = BitCoin;
      $scope.blockchain = BlockChain;
  }])
  .controller('ReceiveCtrl', ['$scope', 'BitCoin',
    function ReceiveCtrlController($scope, BitCoin) {

      $scope.publicAddress = BitCoin.address;
  }])
  .controller('SendCtrl', ['$scope', '$stateParams',
    function SendCtrlController($scope, $stateParams) {

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey
      });
    }
  }])
  .controller('SweepCtrl', ['$scope', '$stateParams',
    function SweepCtrlController($scope, $stateParams) {

      $scope.params = $stateParams;

  }]);
}(angular));
