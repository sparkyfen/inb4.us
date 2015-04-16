'use strict';

angular.module('inb4usApp')
  .directive('smDropdownMenu', ['$timeout', function ($timeout) {
    return {
      templateUrl: 'app/smDropdownMenu/smDropdownMenu.html',
      restrict: 'E',
      replace: true,
      scope: {
        name: '@',
        icon: '@',
        label: '=',
        items: '='
      },
      link: function (scope, element, attrs) {
        $timeout(function () {
          angular.element(element).dropdown();
        }, 10);
      }
    };
  }]);