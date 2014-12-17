'use strict';

angular.module('inb4usApp').controller('DibsCtrl', ['$scope', 'Dibservice', '$routeParams', '$window', '$location', function ($scope, Dibservice, $routeParams, $window, $location) {
  $scope.username = $window.localStorage.getItem('username');
  Dibservice.getDib($routeParams.id).success(function (dibResp) {
    $scope.dib = dibResp;
  }).error(function (error) {
    console.log(error);
    // TODO Show notification when there is an error.
  });
  $scope.viewReport = function() {
    console.log('Viewing Report');
  };
  $scope.reportDib = function() {
    console.log('Reporting dib.');
  };
  $scope.editDib = function() {
    $location.path('/beta/dibs/' + $routeParams.id + '/edit');
  };
  $scope.isReported = function(reports, username) {
    if(!reports) {
      return false;
    }
    if(reports.length === 0) {
      return false;
    }
    if(!username) {
      return false;
    }
    for (var i = 0; i < reports.length; i++) {
      var report = reports[i];
      if(reports.reporter === username) {
        return true;
      }
      return false;
    }
  };
}]);
