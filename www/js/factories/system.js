/*global angular Connection navigator*/
(function withAngular(angular) {
  'use strict';

  angular.module('System.factory', [])
  .service('Network', [function network() {

    this.isOffline = function isOffline() {

      try {

        var networkState = navigator.connection.type
          , isOfflineTest = networkState === Connection.UNKNOWN || networkState === Connection.NONE;
        return isOfflineTest;
      } catch (e) {

        return false;
      }
    };
  }])

  .factory('CordovaNetworkInterceptor', ['$q', 'Network', '$window', '$rootScope',
    function CordovaNetworkInterceptor($q, Network, $window, $rootScope) {

    var isApplicationStarted = false;
    $rootScope.$on('system:started', function onSystemStarted() {

      isApplicationStarted = true;
    });
    return {
      'request': function onRequest(config) {

        if (isApplicationStarted &&
          Network.isOffline() &&
          config &&
          config.url &&
          config.url.indexOf('http') >= 0) {

          $rootScope.$emit('network:offline');
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
