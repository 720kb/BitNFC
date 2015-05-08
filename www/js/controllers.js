/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC.controllers', [])

  .controller('HomeCtrl', function HomeCtrlController() {

  })
  .controller('SettingsCtrl', ['$scope', 'BitCoin',
    function SettingsCtrlController($scope, BitCoin) {

    $scope.test = BitCoin;
  }])
  .controller('ReceiveCtrl', function ReceiveCtrlController() {

  })
  .controller('SendCtrl', ['$scope', '$stateParams', function SendCtrlController($scope, $stateParams) {

    if ($stateParams &&
      $stateParams.privateKey) {

      $scope.privateKey = $stateParams.privateKey;
      $scope.$emit('nfc:write-tag', {
        'txt': $scope.privateKey
      });
    }
  }]);
}(angular));
