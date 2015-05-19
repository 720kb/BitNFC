/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC', [
    'ionic',
    '720kb.fx',
    'bitNFC.filters',
    'bitNFC.providers',
    'bitNFC.factories',
    'bitNFC.controllers',
    'bitNFC.directives'])

  .constant('Config', {
    'currencies': ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'CHF', 'SEK', 'NZD', 'KRW', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CDF', 'CLF', 'CLP', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EEK', 'EGP', 'ETB', 'FJD', 'FKP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'ISK', 'JEP', 'JMD', 'JOD', 'KES', 'KGS', 'KHR', 'KMF', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL']//,
    // 'denominations': ['BTC', 'SATOSHI', 'mBTC']
  })

  .config(['$stateProvider', '$urlRouterProvider', '$logProvider', '$httpProvider',
    function configurationFunction($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

      $logProvider.debugEnabled(false);
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
        'url': '/receive/:pvk',
        'views': {
          'appContent': {
            'templateUrl': 'views/receive/index.html',
            'controller': 'ReceiveCtrl'
          }
        }
      })
      .state('app.send', {
        'url': '/send/:nfcAddress',
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

  .run(['$ionicPlatform', '$rootScope', '$window', '$state', '$ionicPopup', '$log', '$filter', 'nfc', 'BitCoin',
    function onApplicationStart($ionicPlatform, $rootScope, $window, $state, $ionicPopup, $log, $filter, nfc, BitCoin) {

    $ionicPlatform.ready(function onReady() {

      if ($window.cordova &&
        $window.cordova.plugins &&
        $window.cordova.plugins.Keyboard) {

        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if ($window.StatusBar) {

        $window.StatusBar.styleLightContent();
      }

      $rootScope.$emit('system:started');
      $log.debug('Started - phone private key: ' + BitCoin.privateKey.toString());
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

    $rootScope.$on('nfc:status-empty', function onEmptyTag(eventsInformations, payload) {

      if (payload &&
        payload.privateKey) {

        var privateKey = payload.privateKey;
        $rootScope.tagAddress = privateKey.toAddress();
        $ionicPopup.confirm({
          'title': 'An empty NFC tag was found',
          'templateUrl': 'views/popup/empty-tag.html',
          'scope': $rootScope,
          'buttons': [
            {
              'text': 'Cancel'
            },
            {
              'text': 'OK',
              'type': 'button-dark',
              'onTap': function onTap() {

                $state.go('app.send', {
                  'nfcAddress': $rootScope.tagAddress
                }).then(function(){
                  $rootScope.$broadcast('focus');
                });
              }
            }
          ]
        });
      // }
    });

    $rootScope.$on('nfc:status-message', function onMessageTag(eventsInformations, payload) {

      if (payload &&
        payload.privateKey) {

        var tagPrivateKey = payload.privateKey;
        $rootScope.tagAddress = payload.address;
        $rootScope.tagBalance = payload.balance;

        $ionicPopup.confirm({
          'title': 'NFC Wallet found!',
          'templateUrl': 'views/popup/nfc-wallet.html',
          'scope': $rootScope,
          'buttons': [
            {
              'text': 'Cancel'
            },
            {
              'text': 'OK',
              'type': 'button-dark',
              'onTap': function onTap() {

                $log.debug('sweeping tag with private key: ' + tagPrivateKey);

                BitCoin.sweep(tagPrivateKey).then(function onSweep() {
                  $log.debug('swept!');

                  BitCoin.balance().then(function onBalance(newBalance) {
                    var newBalanceMbtc = $filter('UnitConvert')(newBalance, 'satoshisToMbtc');
                    $log.debug('DEBUG!?');

                    $ionicPopup.alert({
                    'title': 'Tag Swept successfully!',
                    'template': '<p>Your balance is now:</p><p>' + newBalanceMbtc + ' mBTC</p>',
                    'buttons': [
                      {
                        'text': 'OK',
                        'type': 'button-dark',
                        'onTap': function onTap() {

                          $state.go('app.home');
                          $rootScope.$emit('balance:trigger-refresh');
                        }
                      }
                    ]
                  });
                  });
                }).catch(function onSweepError(info) {
                  $log.debug('Sweep - an error occurred: ' + JSON.stringify(info));

                  // TODO: mostra il tempo dell'ultima conferma - dice:
                  // 'X minutes elapsed from the latest block'
                  // <small>usually it takes about 10 minutes for a new block to be found</small>
                  // use: https://blockchain.info/latestblock

                  $ionicPopup.alert({
                    'title': 'An error occurred',
                    'template': '<p>NFC Wallet Sweep action was not possible at this time.</p><p>hint: Probably you have to wait for at least one confirmation to do this action.</p>',
                    'buttons': [
                      {
                        'text': 'OK',
                        'type': 'button-dark'
                      }
                    ]
                  });
                });
              }
            }
          ]
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
}(angular));
