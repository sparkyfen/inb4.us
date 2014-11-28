'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/activate/:userId/:token', {
        templateUrl: 'app/user/activate/activate.html',
        controller: 'ActivateCtrl'
      });
  });
