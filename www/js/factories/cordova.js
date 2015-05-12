/*global angular Connection navigator*/
(function withAngular(angular) {
  'use strict';

  angular.module('Cordova.factory', [])
  .factory('CordovaNetworkInterceptor', ['$q', '$window', '$log',
    function CordovaNetworkInterceptor($q, $window, $log) {
    return {
      'request': function (config) {

        var networkState;

        try {

          networkState = navigator.connection.type;

          if (networkState === Connection.UNKNOWN || networkState === Connection.NONE) {

            if (confirm('You are OFFLINE, please connect the device.')) {

              $window.location.reload();
            }
          }
        }
        catch (e) {

          $log.info('Network not available', e);
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
