/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('SendPassive.controller', [])
  .controller('SendPassiveCtrl', ['$scope', '$ionicPopup',
    function SendPassiveCtrlController($scope, $ionicPopup) {

      $ionicPopup.alert({
        'title': 'NFC Empty Tag Detected',
        'templateUrl': 'views/popup/empty-tag.html',
        'scope': $scope
      });
  }]);
}(angular));