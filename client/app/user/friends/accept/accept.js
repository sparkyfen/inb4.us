'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/user/:username/friends/accept', {
        templateUrl: 'app/user/friends/accept/accept.html',
        controller: 'AcceptCtrl'
      });
  });
