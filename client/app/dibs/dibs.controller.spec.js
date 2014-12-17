'use strict';

describe('Controller: DibsCtrl', function () {

  // load the controller's module
  beforeEach(module('inb4usApp'));

  var DibsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DibsCtrl = $controller('DibsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
