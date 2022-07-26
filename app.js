const express   =     require('express')
const mongoose  =    require('mongoose')
const { json }  =    require('express')
const app       =         express()
app.use(express.urlencoded({extended : true}));
app.use(express.json({extended : false }));
app.set('view engine', 'ejs')
const passport  =    require('passport');
const dotenv    =      require('dotenv');
dotenv.config();
app.use('/public', express.static('public'));
const flash     = require('connect-flash');
const session   = require('express-session');
require('./config/passport')(passport);
const LocalStrategy = require('passport-local').Strategy;
const { forwardAuthenticated , ensureAuthenticated } = require('./config/auth');
// DB Config
const db = require('./config/keys').mongoURI;
const axios     =    require('axios')
const homeRoute = require('./routes/Home')
const userRoute = require('./routes/Users')
const loginRoute = require('./routes/Login')
const resetRoute = require('./routes/reset')
const contactRoute = require('./routes/Contact')
const PaymentRoute = require('./routes/Payment')
const OrderRoute   = require('./routes/order')
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
  session({ secret: 'secret',  resave: true, saveUninitialized: true })
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

app.use('/', homeRoute);
app.use('/contact', homeRoute)
app.use('/team', homeRoute)
app.use('/users/register', userRoute)
app.use('/users/login', loginRoute)
app.use('/', resetRoute)
app.use('/contact-email', contactRoute)
app.use('/', PaymentRoute)
app.use('/', OrderRoute)

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
  console.log('server has started listening on port 8080')
})