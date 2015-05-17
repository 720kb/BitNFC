/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Balance.directive', [])
  .directive('balanceRefresh', ['$rootScope', '$filter', '$window', 'BitCoin',
   function onBalanceRefresh($rootScope, $filter, $window, BitCoin) {
    return {
      'restrict': 'E',
      'templateUrl': 'views/module/balanceRefresh.html',
      'link': function onLink(scope, element, attr) {

        var unregisterSettingsTrigger = $rootScope.$on('balance:trigger-refresh', function onTriggerRefresh() {

          scope.balanceCurrency = $window.localStorage.settingsCurrency;
          scope.refreshBalance();
        });

        scope.balanceCurrency = $window.localStorage.settingsCurrency;
        scope.balance = $filter('UnitConvert')(attr.balance, 'satoshisToMbtc');
        scope.refreshBalance = function onRefreshBalance() {

          if (!scope.refreshingBalance) {

            scope.refreshingBalance = true;
            BitCoin.balance().then(function onBalance(balance) {

              BitCoin.toCurrency(balance, scope.balanceCurrency).then(function onSuccess(convertedBalance) {

                scope.balance = $filter('UnitConvert')(balance, 'satoshisToMbtc');
                scope.convertedBalance = convertedBalance;
                scope.refreshingBalance = false;
              });
            });
          }
        };

        scope.refreshBalance();
        scope.$on('$destroy', function unregisterListeners() {

          unregisterSettingsTrigger();
        });
      }
    };
  }]);
}(angular));
