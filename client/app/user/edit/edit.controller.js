'use strict';

angular.module('inb4usApp').controller('EditUserCtrl', ['$scope', 'Userservice', '$location', '$window', function ($scope, Userservice, $location, $window) {
  $scope.passwords = {};
  Userservice.getBySession().success(function (userResp) {
    $scope.user = userResp;
  }).error(function (error, statusCode) {
    // TODO Show error notification on get user request.
  });
  $scope.editUser = function() {
    $scope.isLoading = true;
    var editData = {
      email: $scope.user.email,
      firstname: $scope.user.firstname,
      lastname: $scope.user.lastname
    };
    Userservice.edit(editData).success(function (editResp) {
      $scope.isLoading = false;
      // TODO Show success notificiation on edit user request.
    }).error(function (error, statusCode) {
      $scope.isLoading = false;
      // TODO Show error notification on edit user request.
    });
  };
  $scope.changePassword = function() {
    $scope.isLoading = true;
    Userservice.changePassword($scope.passwords).success(function (passResp) {
      $scope.isLoading = false;
      $location.path('/beta');
      // TODO Show success notification on change password request.
    }).error(function (error, statusCode) {
      $scope.isLoading = false;
      // TODO Show error notification on change password request.
    });
  };
  $scope.deleteUser = function () {
    $scope.isLoading = true;
    Userservice.delete().success(function (deleteResp) {
      $window.localStorage.clear();
      $location.path('/beta');
      // TODO Show success notification on delete user request.
    }).error(function (error, statusCode) {
      // TODO Show error notification on delete user request.
    });
  };
}]);
