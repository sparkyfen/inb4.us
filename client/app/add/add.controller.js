'use strict';

angular.module('inb4usApp').controller('AddCtrl', ['$scope', 'Dibservice', '$location', function ($scope, Dibservice, $location) {
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
    Dibservice.add($scope.dib).success(function (dibResp) {
      // TODO Show notification if success.
      $location.path('/beta');
    }).error(function (error, statusCode) {
      // TODO Show notification on error.
    })
  };
}]);
