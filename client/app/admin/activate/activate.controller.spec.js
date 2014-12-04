'use strict';

describe('Controller: ActivateAdminCtrl', function () {

  // load the controller's module
  beforeEach(module('inb4usApp'));

  var ActivateAdminCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivateAdminCtrl = $controller('ActivateAdminCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
