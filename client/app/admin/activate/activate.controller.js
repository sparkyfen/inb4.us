'use strict';

angular.module('inb4usApp').controller('ActivateAdminCtrl', ['$scope', 'Adminservice', '$routeParams', '$timeout', '$location', function ($scope, Adminservice, $routeParams, $timeout, $location) {
  $scope.adminId = $routeParams.adminId;
  $scope.token = $routeParams.token;
  if(!$scope.adminId || !$scope.token) {
    $scope.validAccount = false;
  }
  var activateData = {
    id: $scope.adminId,
    token: $scope.token
  };
  Adminservice.activate(activateData).success(function (activateResp) {
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
