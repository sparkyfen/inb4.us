'use strict';

angular.module('inb4usApp').service('Adminservice', ['$http', function ($http) {
  return  {
    activate: function(activateData) {
      return $http({
        method: 'POST',
        url: '/api/admin/activate',
        data: activateData
      });
    },
    reset: function (resetData) {
      return $http({
        method: 'POST',
        url: '/api/admin/reset',
        data: resetData
      });
    }
  };
}]);
