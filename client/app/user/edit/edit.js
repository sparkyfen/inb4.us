'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/user/:username/edit', {
        templateUrl: 'app/user/edit/edit.html',
        controller: 'EditUserCtrl'
      });
  });
