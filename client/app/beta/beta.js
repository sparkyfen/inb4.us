'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta', {
        templateUrl: 'app/beta/beta.html',
        controller: 'BetaCtrl'
      });
  });
