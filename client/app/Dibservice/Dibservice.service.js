'use strict';

angular.module('inb4usApp').service('Dibservice', ['$http', function ($http) {
  return {
    getDib: function(id) {
      return $http.get('/api/dibs/' + id)
    },
    edit: function(dibData) {
      return $http({
        method: 'POST',
        url: '/api/dibs/edit',
        data: dibData
      });
    },
    delete: function (dibData) {
      return $http({
        method: 'POST',
        url: '/api/dibs/delete',
        data: dibData
      });
    },
    add: function(dibData) {
      return $http({
        method: 'POST',
        url: '/api/dibs',
        data: dibData
      });
    }
  };
}]);
