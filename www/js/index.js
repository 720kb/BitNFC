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
      .state('tab', {
        'url': '/tab',
        'abstract': true,
        'templateUrl': 'templates/tabs.html'
      })
      .state('tab.dash', {
        'url': '/dash',
        'views': {
          'tab-dash': {
            'templateUrl': 'templates/tab-dash.html',
            'controller': 'DashCtrl'
          }
        }
      })
      .state('tab.chats', {
        'url': '/chats',
        'views': {
          'tab-chats': {
            'templateUrl': 'templates/tab-chats.html',
            'controller': 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        'url': '/chats/:chatId',
        'views': {
          'tab-chats': {
            'templateUrl': 'templates/chat-detail.html',
            'controller': 'ChatDetailCtrl'
          }
        }
      })
      .state('tab.account', {
        'url': '/account',
        'views': {
          'tab-account': {
            'templateUrl': 'templates/tab-account.html',
            'controller': 'AccountCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/tab/dash');
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
