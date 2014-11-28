'use strict';

angular.module('inb4usApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'angularify.semantic']).config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});