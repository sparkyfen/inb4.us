'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/add', {
        templateUrl: 'app/add/add.html',
        controller: 'AddCtrl'
      });
  });
