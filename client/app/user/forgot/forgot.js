'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/user/forgot', {
        templateUrl: 'app/user/forgot/forgot.html',
        controller: 'ForgotCtrl'
      });
  });
