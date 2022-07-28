const express = require('express')
const router = express.Router()
const User =     require('../models/User');
const { forwardAuthenticated , ensureAuthenticated } = require('../config/auth');
const bcrypt =    require('bcryptjs');
const passport =    require('passport');


// Login users
router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/home',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;