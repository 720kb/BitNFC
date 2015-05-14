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

        $rootScope.$emit('nfc:status-message', {'privateKey': '42f997a1aec72e708ff9f7dec26342909c97af5bcca5fef8d7e10cdb1ea295f4'});
      };
  }]);
}(angular));
