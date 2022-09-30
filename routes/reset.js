const express = require('express')
const router = express.Router()
const User =     require('../models/User');
const { forwardAuthenticated , ensureAuthenticated } = require('../config/auth');
const bcrypt =    require('bcryptjs');
const passport =    require('passport');
const jwt = require('jsonwebtoken')
const jwt_secret = 'some super super secret'
const nodemailer = require('nodemailer')
const mongoose  =    require('mongoose')



router.get('/reset', (req, res)=>{
  res.render('reset')
})

router.post('/get-email', function(req, res){
  const { email } = req.body
User.findOne({email:email}).then( user =>{
  if(user){
    const secret = jwt_secret + user.password
  const payload = {
    email: user.email,
    id: user._id
  }
  const token = jwt.sign(payload, secret, {expiresIn:'10m'})
  const link = `http://ppnglobalventures.com/reset-password/${user._id}/${token}`
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service:'gmail',
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD, 
    },
    tls:{
      rejectUnauthorized:false
  }
  });

  // send mail with defined transport object
 options = {
    from: 'gaikonedo@gmail.com', 
    to: email,
    subject: "password reset link", 
    text: "click this link to reset password , it expires after 10 minutes "+ link , 
  };
  transporter.sendMail(options, function(err, info){
    if(err){
      console.log('there was an error')
      console.log(err)
      return
    }else{
   console.log(info.response)
   console.log(link)
   res.send('password reset link has been sent if email exists')
    }
  })
   return  res.render('sent-email')
  }else{
    res.send('there is no user')
  }
})
})



router.get('/reset-password/:id/:token', (req, res)=>{
  let id = mongoose.Types.ObjectId(req.params.id);
  const { token } = req.params
  User.findOne({_id:id}).then( user =>{
    if(user){
   const secret = jwt_secret + user.password
    try{
      console.log(req.params)
  const payload = jwt.verify(token, secret)
  res.render('reset-password', {email : user.email})
    }catch(error){
      console.log(error)
      res.send(error.message)
    }
    }
  else{
    res.send('invalid id')
    return
  }
})
})





router.post('/reset-password/:id/:token', (req, res)=>{
  const { id , token } = req.params
 const {password, password2}= req.body
 let errors = [];
  User.findOne({_id: id}).then( user =>{
    if(user){
   const secret = jwt_secret + user.password
   try{
     const payload = jwt.verify(token, secret)   
  if (password != password2) {
    errors.push({ msg: 'Passwords are not the same' });
  if(errors.length > 0){
    res.render('reset-password', {
      errors
    })
  }
  }else{
     const {password, password2} = req.body
         user.password = password

      //  let newPassword = user.password
         bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password= hash;
            user
              .save()
              .then(user => {
           req.flash('success_msg', `you have successfully changed your password ${user.name}`)
                 res.redirect('/');           
              })
              .catch(err => console.log(err));
          });
        });
  }
   
   }catch(error){
    res.send(error)
   }
    }else{
      res.send('invalid id...')
      return
    }

})
})


module.exports = router;