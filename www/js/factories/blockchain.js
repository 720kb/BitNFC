/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('BlockChain.factory', [])

  .factory('BlockChain', ['$window', '$q', '$http',
    function BitCoinFactory($window, $q, $http) {

      var unspent = function unspent(address) {

          return $q(function deferred(resolve, reject) {

            $http({
              'method': 'GET',
              'url': 'https://blockchain.info/unspent',
              'params': {
                'active': address,
                'format': 'json',
                'cors': true
              }
            }).then(function onSuccess(response) {

              if (response &&
                response.data) {

                resolve(response);
              }
            }).catch(function onError(error) {

              reject(error);
            });
          });
        }
        , balance = function balance(address, handler) {

            $http({
              'method': 'GET',
              'url': 'https://blockchain.info/q/addressbalance/' + address,
              'params': {
                'format': 'json'
              }
            }).then(function onSuccess(response) {

              if (response &&
                response.data) {

                handler(response);
              }
            });
          }
        , pushtx = function pushtx(transactionHash) {

            return $http({
              'method': 'POST',
              'url': 'https://blockchain.info/pushtx',
              'data': transactionHash,
              'params': {
                'format': 'json',
                'cors': true
              }
            });
          };

      return {
        'balance': balance,
        'pushtx': pushtx,
        'unspent': unspent
      };
    }]);
}(angular));
