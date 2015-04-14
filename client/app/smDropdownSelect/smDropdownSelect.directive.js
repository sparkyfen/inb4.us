'use strict';

angular.module('inb4usApp').directive('smDropdownSelect', ['$timeout', function ($timeout) {
    return {
      templateUrl: 'app/smDropdownSelect/smDropdownSelect.html',
      restrict: 'E',
      replace: true,
      scope: {
        items: '=',
        selected: '=',
        searchable: '='
      },
      link: function (scope, element, attrs) {
        $timeout(function () {
          angular.element(element).dropdown();
        }, 10);
      }
    };
  }]);