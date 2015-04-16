'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/beta/terms', {
        templateUrl: 'app/beta/terms/terms.html',
        controller: 'TermsCtrl'
      });
  });
