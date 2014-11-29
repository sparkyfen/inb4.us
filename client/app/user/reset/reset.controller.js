'use strict';

angular.module('inb4usApp').controller('ResetCtrl', ['$scope', 'Userservice', '$routeParams', '$timeout', '$location', function ($scope, Userservice, $routeParams, $timeout, $location) {
  $scope.userId = $routeParams.userId;
  $scope.token = $routeParams.token;
  $scope.reset = function () {
    $scope.submitting = true;
    var resetData = {
      id: $scope.userId,
      token: $scope.token,
      new: $scope.newPass,
      confirm: $scope.confirm
    };
    Userservice.reset(resetData).success(function (resetResp) {
      // TODO Show notification upon success.
      $scope.submitting = false;
      $timeout(function () {
        $location.path('/');
      }, 2000);
    }).error(function (error) {
      $scope.submitting = false;
      $scope.error = true;
      // TODO Show notification if there is an error.
    });
  };
}]);
