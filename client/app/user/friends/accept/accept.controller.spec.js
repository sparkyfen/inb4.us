'use strict';

describe('Controller: AcceptCtrl', function () {

  // load the controller's module
  beforeEach(module('inb4usApp'));

  var AcceptCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AcceptCtrl = $controller('AcceptCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
