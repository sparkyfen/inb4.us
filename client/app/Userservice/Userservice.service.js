'use strict';

angular.module('inb4usApp').service('Userservice', ['$http', function ($http) {
  return  {
    getById: function (id) {
      return $http.get('/api/user' + id);
    },
    getByUsername: function (username) {
      return $http.get('/api/user?username=' + username);
    },
    getBySession: function () {
      return $http.get('/api/user');
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
    },
    addFriend: function(friendData) {
      return $http({
        method: 'POST',
        url: '/api/user/friends',
        data: friendData
      });
    },
    removeFriend: function(friendData) {
      return $http({
        method: 'POST',
        url: '/api/user/friends/delete',
        data: friendData
      });
    },
    getFriends: function(username) {
      return $http.get('/api/user/friends' + (username ? '/?username=' + username : ''));
    },
    edit: function (editData) {
      return $http({
        method: 'POST',
        url: '/api/user',
        data: editData
      });
    },
    changePassword: function(passData) {
      return $http({
        method: 'POST',
        url: '/api/user/change',
        data: passData
      });
    },
    lostPassword: function (lostData) {
      return $http({
        method: 'POST',
        url: '/api/user/lost',
        data: lostData
      });
    }
  };
}]);
