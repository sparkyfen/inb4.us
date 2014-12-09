'use strict';

angular.module('inb4usApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'angularify.semantic', 'noCAPTCHA'])
.config(['noCAPTCHAProvider', '$routeProvider', '$locationProvider', function (noCaptchaProvider, $routeProvider, $locationProvider) {
  noCaptchaProvider.setSiteKey('6LeZEf8SAAAAAORjUJy1lCr9ouUZEUZxYUilirll');
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);