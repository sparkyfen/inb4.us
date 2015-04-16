'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/dibs/:id', {
        templateUrl: 'app/dibs/dibs.html',
        controller: 'DibsCtrl'
      });
  });
