/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Balance.directive', [])
  .directive('BalanceRefresh', ['$filter', function ($filter) {
    return {
      'restrict': 'E',
      'templateUrl': 'views/module/balanceRefresh.html',
      'scope': true,
      'link': function (scope, element, attr) {

        var oldBalance = attr.balance();

        scope.refreshBalance = function () {
        	alert('Yo');
        };
      }
    };
  }])
}(angular));
