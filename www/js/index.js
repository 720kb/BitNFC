/*global angular cordova*/
(function withAngular(angular, cordova) {
  'use strict';

  angular.module('bitNFC', [
    'ionic',
    'bitNFC.providers',
    'bitNFC.factories',
    'bitNFC.controllers'])

  .config(['$stateProvider', '$urlRouterProvider',
    function configurationFunction($stateProvider, $urlRouterProvider) {

      $stateProvider
      .state('app', {
        'url': '/app',
        'abstract': true,
        'templateUrl': 'views/layout/index.html'
      })
      .state('app.home', {
        'url': '/home',
        'views': {
          'appContent': {
            'templateUrl': 'views/home/index.html',
            'controller': 'HomeCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/home');
    }])

  .run(['$ionicPlatform', '$window',
    function onApplicationStart($ionicPlatform, $window) {

      $ionicPlatform.ready(function onReady() {

        if ($window.cordova && $window.cordova.plugins &&
          $window.cordova.plugins.Keyboard) {

          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if ($window.StatusBar) {

        $window.StatusBar.styleLightContent();
      }
    });
    }]);
}(angular, cordova));
