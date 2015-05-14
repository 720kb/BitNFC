/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Settings.controller', [])
  .controller('SettingsCtrl', ['$window', '$scope', 'BitCoin', 'BlockChain', 'Config',
    function SettingsCtrlController($window, $scope, BitCoin, BlockChain, Config) {

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
      };

      $scope.setDenomination = function setCurrency() {

        $window.localStorage.settingsDenomination = $scope.settingsDenomination;
      };

      $scope.setDefaultSettings();
  }]);
}(angular));
