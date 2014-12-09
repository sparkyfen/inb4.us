'use strict';

// Logout user
exports.index = function(req, res) {
  delete req.session.username;
  if(req.session.admin) {
    delete req.session.admin;
  }
  req.session.destroy(function (error) {
    if(error) {
      return res.status(500).jsonp({message: 'Could not log out user.'});
    }
    return res.jsonp({message: 'Logged out.'});
  });
};