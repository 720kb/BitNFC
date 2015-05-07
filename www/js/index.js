/*global angular*/
(function withAngular(angular) {
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
      })
      .state('app.receive', {
        'url': '/receive',
        'views': {
          'appContent': {
            'templateUrl': 'views/receive/index.html',
            'controller': 'ReceiveCtrl'
          }
        }
      })
      .state('app.send', {
        'url': '/send',
        'views': {
          'appContent': {
            'templateUrl': 'views/send/index.html',
            'controller': 'SendCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/home');
    }])

  .run(['$ionicPlatform', '$window', 'nfc',
    function onApplicationStart($ionicPlatform, $window, nfc) {

      $ionicPlatform.ready(function onReady() {

        if ($window.cordova &&
          $window.cordova.plugins &&
          $window.cordova.plugins.Keyboard) {

          $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if ($window.StatusBar) {

        $window.StatusBar.styleLightContent();
      }
    });
    }]);
}(angular));
