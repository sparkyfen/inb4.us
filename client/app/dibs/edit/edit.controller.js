'use strict';

angular.module('inb4usApp').controller('EditCtrl', ['$scope', 'Dibservice', '$window', '$routeParams', '$location', function ($scope, Dibservice, $window, $routeParams, $location) {
  $scope.username = $window.localStorage.getItem('username');
  $scope.isLoading = false;
  Dibservice.getDib($routeParams.id).success(function (dibResp) {
    $scope.dib = dibResp;
  }).error(function (error) {
    console.log(error);
    // TODO Show notification when there is an error.
    $window.history.back();
  });
  $scope.editDib = function() {
    $scope.isLoading = true;
    var dibData = {
      id: $scope.dib._id,
      description: $scope.dib.description,
      image: $scope.dib.image,
      url: $scope.dib.url,
      keywords: $scope.dib.keywords
    };
    console.log(dibData);
    Dibservice.edit(dibData).success(function (dibResp) {
      $scope.isLoading = false;
      // TODO Show notification if we successfully edit the dib.
      $location.path('/beta/dibs/' + $routeParams.id);
    }).error(function (error, statusCode) {
      $scope.isLoading = false;
      // TODO Show notification when there is an error.
    });
  };
  $scope.deleteDib = function() {
    $scope.isLoading = true;
    var dibData = {
      id: $scope.dib._id
    };
    Dibservice.delete(dibData).success(function (dibResp) {
      $scope.isLoading = false;
      $location.path('/beta');
      // TODO Show notification if we successfully delete the dib.
    }).error(function (error, statusCode) {
      console.log(error);
      $scope.isLoading = false;
      // TODO Show notification when there is an error.
    });
  };
}]);
