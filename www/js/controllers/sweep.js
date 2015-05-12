/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Sweep.controller', [])
  .controller('SweepCtrl', ['$scope', '$stateParams',
    function SweepCtrlController($scope, $stateParams) {

      $scope.params = $stateParams;

  }]);
}(angular));
