/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC.controllers', [
    'Debug.controller',
    'Home.controller',
    'Settings.controller',
    'Receive.controller',
    'Send.controller']);
}(angular));
