'use strict';

describe('Directive: smDropdown', function () {

  // load the directive's module and view
  beforeEach(module('inb4usApp'));
  beforeEach(module('app/smDropdown/smDropdown.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sm-dropdown></sm-dropdown>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the smDropdown directive');
  }));
});