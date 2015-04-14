'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/user/:username/friends', {
        templateUrl: 'app/user/friends/friends.html',
        controller: 'FriendsCtrl'
      });
  });
