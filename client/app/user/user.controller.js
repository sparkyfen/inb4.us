'use strict';

angular.module('inb4usApp').controller('UserCtrl', ['$scope', 'Userservice', '$window', '$routeParams', '$location', '$route', function ($scope, Userservice, $window, $routeParams, $location, $route) {
  $scope.username = $window.localStorage.getItem('username') || null;
  Userservice.getByUsername($routeParams.username).success(function (userResp) {
    $scope.user = userResp;
  }).error(function (error, statusCode) {
    // TODO Show error notification on failed user request.
    $scope.error = error.message;
  });
  $scope.addFriend = function () {
    var friendData = {
      username: $routeParams.username
    };
    Userservice.addFriend(friendData).success(function (friendResp) {
      $route.reload();
      // TODO Show success notification on successful friend request.
    }).error(function (error, statusCode) {
      // TODO Show error notification on failed friend request.
    });
  };
  $scope.removeFriend = function () {
    Userservice.getFriends().success(function (friendResp) {
      var friends = friendResp.results;
      for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        if(friend.username === $routeParams.username) {
          var friendId = friend.id;
          break;
        }
      }
      var friendData = {
        id: friendId
      };
      Userservice.removeFriend(friendData).success(function (friendResp) {
        $route.reload();
        // TODO Show success notification on successful friend request.
      }).error(function (error, statusCode) {
        // TODO Show error notification on failed friend request.
      });
    }).error(function (error, statusCode) {

    });
  };
  $scope.editUser = function () {
    $location.path('/beta/user/' + $routeParams.username + '/edit');
  };
  $scope.isPending = function () {
    if(!$scope.user) {
      return false;
    }
    if(!$scope.username) {
      return false;
    }
    if($scope.user.friends.length === 0) {
      return false;
    }
    for (var i = 0; i < $scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      if(friend.username === $scope.username && !friend.accepted) {
        return true;
      }
    }
    return false;
  };
  $scope.isFriends = function () {
    if(!$scope.user) {
      return false;
    }
    if(!$scope.username) {
      return false;
    }
    if($scope.user.friends.length === 0) {
      return false;
    }
    for (var i = 0; i < $scope.user.friends.length; i++) {
      var friend = $scope.user.friends[i];
      if(friend.username === $scope.username) {
        return true;
      }
    }
    return false;
  };
}]);
