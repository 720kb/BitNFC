/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Debug.controller', [])
  .controller('DebugCtrl', ['$rootScope', '$scope',
    function DebugCtrlController($rootScope, $scope) {

      $scope.nfcEmpty = function TriggerNfcEmpty() {

        $rootScope.$emit('nfc:status-empty');
      };

      $scope.nfcMessage = function TriggerNfcMessage() {

        $rootScope.$emit('nfc:status-message');
      };
  }]);
}(angular));
