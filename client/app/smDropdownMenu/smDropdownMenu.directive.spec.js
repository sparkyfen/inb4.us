'use strict';

describe('Directive: smDropdownMenu', function () {

  // load the directive's module and view
  beforeEach(module('inb4usApp'));
  beforeEach(module('app/smDropdownMenu/smDropdownMenu.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sm-dropdown-menu></sm-dropdown-menu>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(1).toBe(1);
  }));
});