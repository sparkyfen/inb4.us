'use strict';

angular.module('inb4usApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'angularify.semantic', 'noCAPTCHA', 'ngDialog', 'angularMoment', 'ui.gravatar'])
.config(['noCAPTCHAProvider', '$routeProvider', '$locationProvider', function (noCaptchaProvider, $routeProvider, $locationProvider) {
  noCaptchaProvider.setSiteKey('6LeZEf8SAAAAAORjUJy1lCr9ouUZEUZxYUilirll');
  $routeProvider
  .otherwise({
    redirectTo: '/beta'
  });
  $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', 'Userservice', '$window', 'Dibservice', function ($rootScope, $location, Userservice, $window, Dibservice) {
  var protectedUserRoutes = [new RegExp(/\/beta\/dibs\/(.*)\/edit/), new RegExp(/\/beta\/user\/(.*)\/edit/)];
  $rootScope.$on('$locationChangeStart', function (event, toState, fromState, toParams, fromParams) {
    var username = $window.localStorage.getItem('username') || null;
    for (var i = 0; i < protectedUserRoutes.length; i++) {
      var route = protectedUserRoutes[i];
      if(route.test($location.path())) {
        Userservice.check().error(function (error) {
          event.preventDefault();
          $window.localStorage.clear();
          $location.path('/beta');
        });
      }
    }
    var userRoute = new RegExp(/\/beta\/user\/(.*)\/edit/);
    if(route.test($location.path())) {
      var routeUser = userRoute.exec($location.path())[1];
      if(username !== routeUser) {
        event.preventDefault();
        $location.path('/beta');
      }
    }
    var route = new RegExp(/\/beta\/dibs\/(.*)\/edit/);
    if(route.test($location.path())) {
      var id = route.exec($location.path())[1];
      Dibservice.getDib(id).success(function (dibResp) {
        if(dibResp.creator !== username) {
          event.preventDefault();
          // TODO Show unauthorized notification.
          $location.path('/beta');
        }
      }).error(function (error) {
        // TODO Show error notification.
      });
    }
  });
}]);
