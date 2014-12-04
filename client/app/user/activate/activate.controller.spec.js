'use strict';

describe('Controller: ActivateUserCtrl', function () {

  // load the controller's module
  beforeEach(module('inb4usApp'));

  var ActivateUserCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivateUserCtrl = $controller('ActivateUserCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
