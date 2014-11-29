'use strict';

angular.module('inb4usApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reset', {
        url: '/user/reset',
        templateUrl: 'app/user/reset/reset.html',
        controller: 'ResetCtrl'
      });
  });