'use strict';

angular.module('inb4usApp').controller('AcceptCtrl', ['$scope', '$routeParams', 'Userservice', function ($scope, $routeParams, Userservice) {
  var friendData = {
    username: $routeParams.friend
  };
  Userservice.addFriend(friendData).success(function (friendResp) {
    $scope.accepted = true;
    $scope.message = friendResp.message;
  }).error(function (error, statusCode) {
    $scope.accepted = false;
    $scope.errorMessage = error.message;
  });
}]);
