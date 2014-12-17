'use strict';

angular.module('inb4usApp').service('Userservice', ['$http', function ($http) {
  return  {
    get: function (id) {
      return $http.get('/api/user' + (id ? '/' + id : ''))
    },
    login: function (loginData) {
      return $http({
        method: 'POST',
        url: '/api/user/login',
        data: loginData
      });
    },
    logout: function () {
      return $http.get('/api/user/logout');
    },
    activate: function(activateData) {
      return $http({
        method: 'POST',
        url: '/api/user/activate',
        data: activateData
      });
    },
    reset: function (resetData) {
      return $http({
        method: 'POST',
        url: '/api/user/reset',
        data: resetData
      });
    },
    check: function () {
      return $http.get('/api/user/check');
    },
    register: function(registerData) {
      return $http({
        method: 'POST',
        url: '/api/user/register',
        data: registerData
      });
    }
  };
}]);
