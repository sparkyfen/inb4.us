'use strict';

angular.module('inb4usApp').controller('BetaCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.loadDib = function () {
    $location.path('/beta/dibs/' + $scope.resp[0].id);
  };
}]);