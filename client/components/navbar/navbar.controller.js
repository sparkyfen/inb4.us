'use strict';

angular.module('inb4usApp').controller('NavbarCtrl', ['$scope', '$location', 'ngDialog', '$window', '$route', 'Userservice', function ($scope, $location, ngDialog, $window, $route, Userservice) {
  $scope.menu = [{
    title: 'inb4',
    icon: 'home',
    link: '/beta'
  }];
  if($window.localStorage.getItem('username')) {
    $scope.username = $window.localStorage.getItem('username');
    $scope.menu.push({
      title: 'Account',
      icon: 'user',
      link: '/beta/user/' + $scope.username
    })
  }
  $scope.isActive = function(route) {
    return route === $location.path();
  };
  $scope.logout = function() {
    Userservice.logout().success(function (logoutResp) {
      // TODO Show success notification on successful logout.
      $window.localStorage.clear();
      $route.reload();
    }).error(function (error) {
      $window.localStorage.clear();
      $route.reload();
      // TODO Show error notification on failed logout.
    });
  }
  $scope.openModal = function () {
    var loginModal = ngDialog.open({
      template: 'components/navbar/modal.html',
      className: 'ngdialog-theme-default',
      closeByDocument: true,
      closeByEscape: true,
      overlay: false,
      controller: ['$scope', 'ngDialog', 'Userservice', '$window', function ($scope, ngDialog, Userservice, $window) {
        $scope.login = function() {
          var loginData = {
            username: $scope.username,
            password: $scope.password
          };
          Userservice.login(loginData).success(function (loginResp) {
            // TODO Show success notification on successful login.
            $window.localStorage.setItem('username', $scope.username);
            loginModal.close();
            $route.reload();
          }).error(function (error) {
            // TODO Show error notification on failed login.
          });
        };
        $scope.openRegister = function () {
          var registerModal = ngDialog.open({
            template: 'components/navbar/register.html',
            overlay: false,
            closeByDocument: true,
            closeByEscape: true,
            className: 'ngdialog-theme-default',
            controller: ['$scope', 'Userservice', function ($scope, Userservice) {
              $scope.closeModal = function () {
                registerModal.close();
                loginModal.close();
              };
              $scope.register = function () {
                var registerData = {
                  username: $scope.username,
                  password: $scope.password,
                  email: $scope.email
                };
                Userservice.register(registerData).success(function (registerResp) {
                  // TODO Show success notification on successful registration.
                  registerModal.close();
                }).error(function (error) {
                  console.log(error);
                  // TODO Show error notification on failed registration.
                });
              };
            }]
          });
        };
      }]
    });
  };
}]);