'use strict';

// Logout admin
exports.index = function(req, res) {
  delete req.session.username;
  delete req.session.admin;
  req.session.destroy(function (error) {
    if(error) {
      return res.status(500).jsonp({message: 'Could not log out admin.'});
    }
    return res.jsonp({message: 'Logged out.'});
  });
};