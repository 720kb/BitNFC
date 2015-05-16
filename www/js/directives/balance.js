/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Balance.directive', [])
  .directive('balanceRefresh', ['$filter', 'BitCoin', function ($filter, BitCoin) {
    return {
      'restrict': 'E',
      'templateUrl': 'views/module/balanceRefresh.html',
      'link': function (scope, element, attr) {

        scope.balance = $filter('UnitConvert')(attr.balance, 'satoshisToMbtc');

        scope.refreshBalance = function () {

          if (!scope.refreshingBalance) {

            scope.refreshingBalance = true;
            BitCoin.balance().then(function onBalance(balance) {

              scope.balance = $filter('UnitConvert')(balance, 'satoshisToMbtc');
              scope.refreshingBalance = false;
            });
          }
        };
        scope.refreshBalance();
      }
    };
  }]);
}(angular));
