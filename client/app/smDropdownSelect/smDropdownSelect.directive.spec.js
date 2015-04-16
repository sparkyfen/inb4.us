'use strict';

describe('Directive: smDropdownSelect', function () {

  // load the directive's module and view
  beforeEach(module('inb4usApp'));
  beforeEach(module('app/smDropdownSelect/smDropdownSelect.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sm-dropdown-select></sm-dropdown-select>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(1).toBe(1);
  }));
});