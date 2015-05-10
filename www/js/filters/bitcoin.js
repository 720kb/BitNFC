/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('UnitConvert.filter', [])

  .filter('UnitConvert', [function () {

    var bitcore = require('bitcore')
      , result;

    return function UnitConvert(amount, FromToString) {
      /*eslint-disable new-cap*/
      switch (FromToString) {
        case 'mbtcToBtc':
          result = new bitcore.Unit.fromMilis(amount).toBTC();
          break;
        case 'satoshiToMbtc':
          result = new bitcore.Unit.fromSatoshis(amount).mBTC;
          break;
        // case 'mbtcToSatoshi':
        //   // TODO
        // case 'btcToSatoshi':
        //   // TODO
        // case 'satoshiToBtc':
        //   // TODO
        // case 'btcToMbtc':
        //   // TODO
        default:
          result = '9999999 [match not found - fix!] case: ' + FromToString;
      }

      return result;
      /*eslint-enable new-cap*/
    };
  }]);
}(angular, require));

// {{address | Unit | convert:amount:unitFrom:unitTo }} //=> number
// {{address | Unit | convert:100:mbtc:btc }} //=> 0.1
