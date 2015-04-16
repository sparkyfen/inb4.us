'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/dibs/:id/edit', {
        templateUrl: 'app/dibs/edit/edit.html',
        controller: 'EditCtrl'
      });
  });
