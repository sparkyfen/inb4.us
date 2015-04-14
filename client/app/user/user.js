'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/user/:username', {
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });
