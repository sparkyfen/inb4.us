'use strict';

angular.module('inb4usApp').directive('smPopup', function () {
    return {
      templateUrl: 'app/smPopup/smPopup.html',
      replace: true,
      scope: {
        header: '@',
        image: '@',
        content: '@',
        postition: '='
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
        angular.element('.popup').popup({
          inline: false,
          preserve: true,
          on : 'hover',
          postition: scope.postition,
          delay: {
            show: 300,
            hide: 300
          }
        });
      }
    }
  });