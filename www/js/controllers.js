/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC.controllers', [])

  .controller('HomeCtrl', function HomeCtrlController() {

  })
  .controller('SettingsCtrl', function SettingsCtrlController() {

  })
  .controller('ReceiveCtrl', function ReceiveCtrlController() {

  })
  .controller('SendCtrl', function SendCtrlController($scope, $stateParams) {

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey
      });
    }
  });
}(angular));
