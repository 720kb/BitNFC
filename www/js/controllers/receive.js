/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Receive.controller', [])
  .controller('ReceiveCtrl', ['$scope', 'BitCoin',
    function ReceiveCtrlController($scope, BitCoin) {

      $scope.publicAddress = BitCoin.address;
  }]);
}(angular));
