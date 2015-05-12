/*global angular Connection navigator*/
(function withAngular(angular) {
  'use strict';

  angular.module('System.factory', [])
  .service('Network', [function () {

    this.isOffline = function isOffline() {

      try {

        var networkState = navigator.connection.type;
        return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
      } catch (e) {

        return false;
      }
    };

    /*this.whenOffline = function whenOffline() {

      $timeout(function () {

        if (confirm('You are OFFLINE, please connect the device and click OK')) {

          $window.location.reload();
        }
      }, 0);*/
  }])
  .factory('CordovaNetworkInterceptor', ['$q', 'Network', '$window',
    function CordovaNetworkInterceptor($q, Network, $window) {
    return {
      'request': function onRequest(config) {

        if (Network.isOffline()) {

          $window.alert('you\'re offline');
        }

        return config || $q.when(config);
      }
    };
  }])
  .factory('CordovaClipboard', ['$q', '$window',
    function CordovaClipboard($q, $window) {

      var q
        , copy = function copyClipboard(text) {

          q = $q.defer();

          $window.cordova.plugins.clipboard.copy(text, function copyClipboardSuccess() {

            q.resolve();
          }, function copyClipboardFail(error) {

            q.reject(error);
          });

          return q.promise;
        },
        paste = function pasteClipboard() {

          q = $q.defer();

          $window.cordova.plugins.clipboard.paste(function pasteClipboardSuccess(text) {

            q.resolve(text);
          }, function pasteClipboardFail(error) {

            q.reject(error);
          });

          return q.promise;
        };

      return {
        'copy': copy,
        'paste': paste
      };
  }]);
}(angular));
