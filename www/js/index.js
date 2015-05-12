/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC', [
    'ionic',
    '720kb.fx',
    'bitNFC.filters',
    'bitNFC.providers',
    'bitNFC.factories',
    'bitNFC.controllers'])

  .constant('Config', {
    'currencies': ['EUR', 'BTC', 'RUB', 'YEN', 'US'],
    'denominations': ['BTC', 'SATOSHI', 'mBTC']
  })

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function configurationFunction($stateProvider, $urlRouterProvider, $httpProvider) {

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
      .state('app.sweep', {
        'url': '/sweep',
        'params': {
          'privateKey': undefined
        },
        'views': {
          'appContent': {
            'templateUrl': 'views/sweep/index.html',
            'controller': 'SweepCtrl'
          }
        }
      })
      .state('app.send', {
        'url': '/send',
        // 'params': {
        //   'privateKey': undefined
        // },
        'views': {
          'appContent': {
            'templateUrl': 'views/send/index.html',
            'controller': 'SendCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/home');
  }])

  .run(['$ionicPlatform', '$rootScope', '$window', '$state', '$ionicPopup', 'nfc', 'BitCoin',
    function onApplicationStart($ionicPlatform, $rootScope, $window, $state, $ionicPopup, nfc, BitCoin) {

    var address
      , privateKey
      , balance;

    $rootScope.debugMode = true; //false

    $ionicPlatform.ready(function onReady() {

      if ($window.cordova &&
        $window.cordova.plugins &&
        $window.cordova.plugins.Keyboard) {

        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if ($window.StatusBar) {

        $window.StatusBar.styleLightContent();
      }

      nfc.registerListeners();
    });

    $rootScope.$on('nfc:status-ok', function onNfcStatusOk() {

      $rootScope.nfcStatus = true;
    });

    $rootScope.$on('nfc:status-ko', function onNfcStatusOk(eventsInformations, payload) {

      $rootScope.nfcStatus = false;

      if (payload &&
        payload.error) {

        $ionicPopup.alert({
          'title': 'Oh snap!',
          'template': payload.error
        });
      }
    });

    $rootScope.$on('nfc:status-empty', function onEmptyTag() {

      privateKey = BitCoin.generatePrivateKey();
      address = privateKey.toAddress();

      $ionicPopup.confirm({
        'title': 'NFC Empty Tag Detected',
        'template': '<h4>NFC Wallet Generated</h4><p>Your empty NFC tag is now a bitcoin wallet<p><p>A Private Key has been loaded into the Tag and this is the corresponding (public) Address: ' + address.toString() + ' - 0 mBTC -- you can now send money to the token.</p>'
      }).then(function onUserTouch(res) {

        if (res) {

          $state.go('app.send', {
            'address': address
          });
        }
      });
    });

    $rootScope.$on('nfc:status-message', function onMessageTag() {

      privateKey = '5antani';
      address = '1antani';
      balance = 123;

      $ionicPopup.confirm({
        'title': 'Detected NFC Tag with Wallet',
        'template': '<p>Private Key: ' + privateKey + '</p><p>Address: ' + address + '</p><p>Containing ' + balance + ' mBTC</p>'
      }).then(function onUserTouch(res) {

        if (res) {

          $state.go('app.send', {
            // 'privateKey': ,
            'address': BitCoin.address
          });
        }
      });
    });
  }]);
}(angular));
