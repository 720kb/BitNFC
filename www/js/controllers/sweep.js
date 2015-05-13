/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Sweep.controller', [])
  .controller('SweepCtrl', ['$scope', '$stateParams',
    function SweepCtrlController($scope, $stateParams) {

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey.toString()
      });
    }
  }]);
}(angular));
