/*global angular document window*/
(function withAngular(angular, document, window) {
  'use strict';

  var bootstrapAngular = function bootstrapAngular() {

    var domElement = document.getElementsByTagName('html')[0];
    angular.bootstrap(domElement, ['bitNFC']);
  };

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
        'views': {
          'appContent': {
            'templateUrl': 'views/send/index.html',
            'controller': 'SendCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/home');
      $httpProvider.interceptors.push('CordovaNetworkInterceptor');
  }])

  .run(['$ionicPlatform', '$rootScope', '$window', '$state', '$ionicPopup', 'nfc', 'BitCoin', 'BlockChain',
    function onApplicationStart($ionicPlatform, $rootScope, $window, $state, $ionicPopup, nfc, BitCoin, BlockChain) {

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

      var privateKey = BitCoin.generatePrivateKey();

      $rootScope.tagAddress = privateKey.toAddress();
      $ionicPopup.confirm({
        'title': 'NFC Empty Tag Detected',
        'templateUrl': 'views/popup/empty-tag.html',
        'scope': $rootScope
      }).then(function onUserTouch(res) {

        /*if (res) {

          $state.go('app.sweep', {
            'privateKey': privateKey
          });
        }*/
      });
    });

    $rootScope.$on('nfc:status-message', function onMessageTag(eventsInformations, payload) {

      if (payload &&
        payload.privateKey) {

        var tagPrivateKey = BitCoin.fromPrivateKey(payload.privateKey);

        $rootScope.tagAddress = tagPrivateKey.toAddress();
        BlockChain.balance($rootScope.tagAddress).then(function onBalance(tagBalance) {

          $rootScope.tagBalance = tagBalance;
          $ionicPopup.confirm({
            'title': 'Detected NFC Tag with Wallet',
            'templateUrl': 'views/popup/nfc-wallet.html',
            'scope': $rootScope
          }).then(function onUserTouch(res) {

            /*if (res) {

              $state.go('app.send', {
                // 'privateKey': ,
                'address': BitCoin.address
              });
            }*/
          });
        });
      }
    });

    $rootScope.$on('network:offline', function onNetworkOffline() {

      $ionicPopup.confirm({
        'title': 'NETWORK ERROR',
        'templateUrl': 'views/popup/network-down.html'
      }).then(function onUserTouch(res) {

        if (res) {

          $state.go('app.home');
        }
      });
    });

  }]);

  if (window.cordova) {

    document.addEventListener('deviceready', function onDeviceReady() {

      bootstrapAngular();
    }, false);
  } else {

    window.setTimeout(function timeOutFired() {

      bootstrapAngular();
    }, 0);
  }
}(angular, document, window));
