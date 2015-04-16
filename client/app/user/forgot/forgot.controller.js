'use strict';

angular.module('inb4usApp').controller('ForgotCtrl', ['$scope', 'Userservice', '$location', function ($scope, Userservice, $location) {
  $scope.lostPassword = function() {
    $scope.isLoading = true;
    var lostData = {
      email: $scope.email
    };
    Userservice.lostPassword(lostData).success(function (lostResp) {
      $scope.isLoading = false;
      $scope.hasError = false;
      $location.path('/beta');
      // TODO Show success notification on lost password request.
    }).error(function (error, statusCode) {
      $scope.isLoading = false;
      $scope.hasError = true;
      $scope.errorMessage = error.message;
      // TODO Show error notification on lost password request.
    });
  };
}]);
