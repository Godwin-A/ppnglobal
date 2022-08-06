const express = require('express')
const router = express.Router()
const User =     require('../models/User');
const { forwardAuthenticated , ensureAuthenticated } = require('../config/auth');
const bcrypt =    require('bcryptjs');




router.get('/',forwardAuthenticated, function(req, res){
  res.render('signUp')
})

//register users
router.post('/',(req, res) => {
  const { name, email, password, phone, password2 } = req.body;
  let errors = [];

  if (!name || !email || !phone || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('signUp', {
      errors,
      name,
      email,
      phone,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('signUp', {
          errors,
          name,
          email,
          phone,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          phone,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                 req.flash('success_msg', 'Welcome to ppn global ventures ' + user.name)
                 res.redirect('/');           
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});




module.exports = router