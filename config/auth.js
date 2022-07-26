module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      console.log('user never  log in yet oo, make them no con hack your account o')
      return next();
    }
 res.redirect('/')
  }
};
