'use strict';

angular.module('inb4usApp').directive('smSearch', function () {
    return {
      templateUrl: 'app/smSearch/smSearch.html',
      restrict: 'E',
      require: '?ngModel',
      scope: {
        minCharacters: '=',
        cache: '=',
        type: '=',
        debug: '=',
        duration: '=',
        maxResults: '=',
        verbose: '=',
        results: '=',
        placeholder: '=',
        value: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch('query', function (oldVal, newVal) {
          if(newVal) {
            angular.element(element)
            .search({
              apiSettings: {
                url: '/api/search/dibs/'+(scope.type ? scope.type : 'all')+'/' + scope.query
              },
              minCharacters: scope.minCharacters,
              cache: scope.cache,
              debug: scope.debug,
              maxResults: scope.maxResults,
              verbose: scope.verbose,
              duration: scope.duration,
              searchFields: ['title', 'description'],
              onSearchQuery: function(event) {
                scope.isLoading = true;
                return event;
              },
              onResults: function(resp, foo) {
                scope.isLoading = false;
                scope.results = resp.results;
                scope.value = scope.query;
                return resp;
              }
            });
          }
        });
      }
    };
  });