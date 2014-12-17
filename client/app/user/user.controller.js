'use strict';

angular.module('inb4usApp').controller('UserCtrl', ['$scope', 'Userservice', '$window', '$routeParams', function ($scope, Userservice, $window, $routeParams) {
  $scope.username = $window.localStorage.getItem('username') || null;
  Userservice.get($routeParams.username).success(function (userResp) {
    $scope.user = userResp;
  }).error(function (error, statusCode) {
    // TODO Show error notification on failed user request.
    console.log(error);
  });
  $scope.addFriend = function () {
    // TODO Write add friend function call
  };
  $scope.editUser = function () {
    // TODO Write edit user function call
  };
  $scope.isFriends = function () {
    if(!$scope.user) {
      return false;
    }
    if(!$scope.username) {
      return false;
    }
    for (var i = 0; i < $scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      if(friend === username) {
        return true;
      }
    }
    return false;
  };
}]);
