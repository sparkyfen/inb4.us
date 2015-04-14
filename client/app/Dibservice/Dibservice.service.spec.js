'use strict';

describe('Service: Dibservice', function () {

  // load the service's module
  beforeEach(module('inb4usApp'));

  // instantiate service
  var Dibservice;
  beforeEach(inject(function (_Dibservice_) {
    Dibservice = _Dibservice_;
  }));

  it('should do something', function () {
    expect(!!Dibservice).toBe(true);
  });

});
