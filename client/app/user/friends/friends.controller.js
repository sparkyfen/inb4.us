'use strict';

angular.module('inb4usApp').controller('FriendsCtrl', ['$scope', 'Userservice', '$routeParams', function ($scope, Userservice, $routeParams) {
  Userservice.getFriends($routeParams.username).success(function (friendResp) {
    $scope.friends = friendResp.results;
  }).error(function (error, statusCode) {
    // TODO Show error notification on get friend error.
  });
}]);
