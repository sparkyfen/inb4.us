'use strict';

angular.module('inb4usApp').controller('ActivateCtrl', ['$scope', 'Userservice', '$routeParams', '$timeout', '$location', function ($scope, Userservice, $routeParams, $timeout, $location) {
  $scope.userId = $routeParams.userId;
  $scope.token = $routeParams.token;
  if(!$scope.userId || !$scope.token) {
    $scope.validAccount = false;
  }
  var activateData = {
    id: $scope.userId,
    token: $scope.token
  };
  Userservice.activate(activateData).success(function (activateResp) {
    // TODO Show notification upon success.
    $scope.validAccount = true;
    $timeout(function () {
      $location.path('/');
    }, 2000);
  }).error(function (error) {
    $scope.validAccount = false;
    // TODO Show notification if there is an error.
  });
}]);
