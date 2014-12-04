'use strict';

angular.module('inb4usApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/activate/:adminId/:token', {
        templateUrl: 'app/admin/activate/activate.html',
        controller: 'ActivateAdminCtrl'
      });
  });
