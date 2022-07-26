const express   =     require('express')
const mongoose  =    require('mongoose')
const { json }  =    require('express')
const axios     =    require('axios')
const app       =         express()
app.use(express.urlencoded({extended : true}));
app.use(express.json({extended : false }));
app.set('view engine', 'ejs')
const bcrypt =    require('bcryptjs');
const passport =    require('passport');
const dotenv = require('dotenv');
dotenv.config();
app.use('/public', express.static('public'));
const flash = require('connect-flash');
const session = require('express-session');
require('./config/passport')(passport);
const nodemailer = require('nodemailer')
const LocalStrategy = require('passport-local').Strategy;
const User =     require('./models/User');
const { forwardAuthenticated , ensureAuthenticated } = require('./config/auth');
// DB Config
const db = require('./config/keys').mongoURI;


// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
 const jwt = require('jsonwebtoken')

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const jwt_secret = 'some super super secret'

app.get('/',  (req, res)=>{
  res.render('home', {user : req.user})
})

app.get('/contact', (req, res)=>{
  res.render('contactform')
})



app.get('/team', function (req, res) {
  res.render('team')
})

app.get('/users/register',forwardAuthenticated, function(req, res){
  res.render('signUp')
})

//register users
app.post('/users/register', (req, res) => {
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

// Login users
app.post('/users/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/home',
    failureFlash: true
  })(req, res, next);
});

app.get('/reset', (req, res)=>{
  res.render('reset')
})

app.post('/get-email', function(req, res){
  const { email } = req.body
User.findOne({email:email}).then( user =>{
  if(user){
    const secret = jwt_secret + user.password
  const payload = {
    email: user.email,
    id: user._id
  }
  const token = jwt.sign(payload, secret, {expiresIn:'10m'})
  const link = `http://localhost:8080/reset-password/${user._id}/${token}`
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
    console.log(user)
    res.send('email found , check vscode now')
  }else{
    res.send('there is no user')
  }
})
})



app.get('/reset-password/:id/:token', (req, res)=>{
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





app.post('/reset-password/:id/:token', (req, res)=>{
  const { id , token } = req.params
 const {password, password2}= req.body
  User.findOne({_id: id}).then( user =>{
    if(user){
   const secret = jwt_secret + user.password
   try{
     const payload = jwt.verify(token, secret)   
  if (password != password2) {
   res.send('passwords do not match')
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



app.post('/contact-email',(req, res)=>{
  const {name, email, message} = req.body
     let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service:'gmail',
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD 
      },
      tls:{
        rejectUnauthorized:false
    }
    });
  
   options = {
      from: 'gaikonedo@gmail.com', 
      to: 'ppnglobalventureslimited@gmail.com',
      subject: "people contacted you through the website", 
      text: `client email: ${email}, client name:${name}, message:${message}` , 
      // html: "<b>Hello world?</b>", // html body
    };
    transporter.sendMail(options, function(err, info){
      if(err){
        console.log('there was an error')
        console.log(err)
        return
      }else{
     console.log(info.response)
   req.flash('success_msg', 'message sent, thanks for contacting us!')
   res.redirect('/'); 
      }
    })
})

app.get('/pay', (req, res)=>{
  res.render('payment', {user : req.user})
})


app.get('/pay/approved', async(req, res)=>{
  const { transaction_id } = req.query;
  const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
  const response = await axios({
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: process.env.SECRET,
    },
  }).then(
    res.render('confirmation-page')
  )
  .catch(
    res.render('error-page')
  )
})


const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
  console.log('server has started listening on port 8080')
})