'use strict';

angular.module('inb4usApp').controller('AddCtrl', ['$scope', 'Dibservice', '$location', '$window', function ($scope, Dibservice, $location, $window) {
  $scope.username = $window.localStorage.getItem('username');
  if(!$scope.username) {
    $scope.hasWarning = true;
  }
  $scope.dib = {
    type: 'person'
  };
  $scope.items = [{
    title: 'Person',
    value: 'person'
  },{
    title: 'Place',
    value: 'place'
  },{
    title: 'Thing',
    value: 'thing'
  }];
  $scope.callDibs = function() {
    if(!$scope.username) {
      $scope.hasWarning = false;
      $scope.hasError = true;
    } else {
      $scope.hasWarning = false;
      $scope.hasError = false;
      Dibservice.add($scope.dib).success(function (dibResp) {
        // TODO Show notification if success.
        $location.path('/beta');
      }).error(function (error, statusCode) {
        // TODO Show notification on error.
      });
    }
  };
}]);
