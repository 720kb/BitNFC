/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Home.controller', [])
  .controller('HomeCtrl', ['$rootScope', '$scope', 'BitCoin',
    function HomeCtrlController($rootScope, $scope, BitCoin) {

      $scope.publicAddress = BitCoin.address.toString();
      BitCoin.balance().then(function onBalance(balance) {

        $scope.balance = balance;
      });
  }]);
}(angular));
