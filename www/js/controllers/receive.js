/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Receive.controller', [])
  .controller('ReceiveCtrl', ['$scope', '$stateParams', 'BitCoin',
    function ReceiveCtrlController($scope, $stateParams, BitCoin) {

      $scope.publicAddress = BitCoin.address;
      $scope.pvk = $stateParams.pvk;
  }]);
}(angular));
