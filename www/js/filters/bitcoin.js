/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('Unit.filter', [])

  .filter('Unit',[ function () {

    return function convert(amount, unitFrom, unitTo) {

      switch (unitFrom+':'+unitTo) {
        case 'mbtc:btc':
          new bitcore.Unit.fromMilis(amount).toBTC();
        case 'btc:mbtc':
          // TODO
        case 'satoshi:mbtc':
          // TODO
        case 'mbtc:satoshi':
          // TODO
        case 'btc:satoshi':
          // TODO
        case 'satoshi:btc':
          // TODO
        default:
          '9999999 [match not found - fix!]';
      }
    };
  }]);
}(angular, require));

// {{address | Unit | convert:amount:unitFrom:unitTo }} //=> number
// {{address | Unit | convert:100:mbtc:btc }} //=> 0.1
