/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('Cordova.factory', [])

  .factory('CordovaClipboard', ['$q', '$window',
    function CordovaClipboard($q, $window) {

      var q
        , copy = function copyClipboard(text) {

          q = $q.defer();

          $window.cordova.plugins.clipboard.copy(text, function copyClipboardSuccess() {

            q.resolve();
          }, function copyClipboardFail() {

            q.reject();
          });

          return q.promise;
        },
        paste = function pasteClipboard() {

          q = $q.defer();

          $window.cordova.plugins.clipboard.paste(function pasteClipboardSuccess(text) {

            q.resolve(text);
          }, function pasteClipboardFail() {

            q.reject();
          });

          return q.promise;
        };

      return {
        'copy': copy,
        'paste': paste
      };
  }]);
}(angular));
