'use strict';

// Checks cookie
exports.index = function(req, res) {
  var checkAdmin = req.param('admin');
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sigin in.'});
  }
  if(checkAdmin && !req.session.admin) {
    return res.status(401).jsonp({message: 'Admins only.'});
  }
  return res.jsonp({message: 'Valid session.'});
};