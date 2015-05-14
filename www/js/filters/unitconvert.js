/*global angular require*/
(function withAngular(angular, require) {
  'use strict';

  angular.module('UnitConvert.filter', [])

  .filter('UnitConvert', [function UnitConvertFilter() {

    var bitcore = require('bitcore')
      , result;

    return function UnitConvert(amount, FromToString) {
      /*eslint-disable new-cap*/
      switch (FromToString) {
        case 'mbtcToBtc':
          result = new bitcore.Unit.fromMilis(amount).toBTC();
          break;
        case 'satoshisToMbtc':
          result = new bitcore.Unit.fromSatoshis(amount).mBTC;
          break;
        case 'satoshisToBtc':
          result = new bitcore.Unit.fromSatoshis(amount).BTC;
          break;
        case 'mbtcToSatoshis':
          result = new bitcore.Unit.fromMilis(amount).satoshis;
          break;
        // case 'btcToSatoshi':
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
