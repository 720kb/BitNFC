/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Settings.controller', [])
  .controller('SettingsCtrl', ['$rootScope', '$window', '$scope', 'BitCoin', 'BlockChain', 'Config',
    function SettingsCtrlController($rootScope, $window, $scope, BitCoin, BlockChain, Config) {

      $scope.bitcoin = BitCoin;
      $scope.blockchain = BlockChain;
      $scope.denominations = Config.denominations;
      $scope.currencies = Config.currencies;

      $scope.setDefaultSettings = function setDefaultSettings() {

        $scope.settingsCurrency = $window.localStorage.settingsCurrency || 'BTC';
        $scope.settingsDenomination = $window.localStorage.settingsDenomination || 'mBTC';
        $window.localStorage.settingsCurrency = $scope.settingsCurrency;
        $window.localStorage.settingsDenomination = $scope.settingsDenomination;
      };

      $scope.setCurrency = function setCurrency() {

        $window.localStorage.settingsCurrency = $scope.settingsCurrency;
        $rootScope.$emit('balance:trigger-refresh');
      };

      $scope.setDenomination = function setCurrency() {

        $window.localStorage.settingsDenomination = $scope.settingsDenomination;
      };

      $scope.setDefaultSettings();
  }]);
}(angular));
