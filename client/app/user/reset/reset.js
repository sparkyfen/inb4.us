'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/reset', {
        templateUrl: 'app/user/reset/reset.html',
        controller: 'ResetCtrl'
      });
  });