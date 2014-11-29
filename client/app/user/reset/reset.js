'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/reset/:userId/:token', {
        templateUrl: 'app/user/reset/reset.html',
        controller: 'ResetCtrl'
      });
  });