/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('UnitConvert.filter', [])

  .filter('UnitConvert',[function () {

    var bitcore = require('bitcore');

    return function UnitConvert(amount, FromToString) {

      switch (FromToString) {
        case 'mbtcToBtc':
          return new bitcore.Unit.fromMilis(amount).toBTC();
          break;
        // case 'btcToMbtc':
        //   // TODO
        // case 'satoshiToMbtc':
        //   // TODO
        // case 'mbtcToSatoshi':
        //   // TODO
        // case 'btcToSatoshi':
        //   // TODO
        // case 'satoshiToBtc':
        //   // TODO
        default:
          return '9999999 [match not found - fix!] case: '+FromToString;
      }
    };
  }]);
}(angular, require));

// {{address | Unit | convert:amount:unitFrom:unitTo }} //=> number
// {{address | Unit | convert:100:mbtc:btc }} //=> 0.1
