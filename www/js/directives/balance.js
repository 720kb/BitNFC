/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Balance.directive', [])
  .directive('balanceRefresh', ['$filter', 'BitCoin', function ($filter, BitCoin) {
    return {
      'restrict': 'E',
      'templateUrl': 'views/module/balanceRefresh.html',
      'link': function (scope, element, attr) {

        scope.balance = attr.balance;

        scope.refreshBalance = function () {

          if (!scope.refreshingBalance) {

            scope.refreshingBalance = true;
            BitCoin.balance().then(function onBalance(balance) {

              scope.balance = balance;
              scope.refreshingBalance = false;
            });
          }
        };
      }
    };
  }]);
}(angular));
