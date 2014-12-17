'use strict';

describe('Directive: sm-popup', function () {

  // load the directive's module and view
  beforeEach(module('inb4usApp'));
  beforeEach(module('app/smPopup/smPopup.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sm-popup></sm-popup>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the popup directive');
  }));
});