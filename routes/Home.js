const express = require('express')
const router = express.Router()

router.get('/',  (req, res)=>{
  res.render('home', {user : req.user})
})


router.get('/contact', (req, res)=>{
  res.render('contactform')
})

router.get('/team', function (req, res) {
  res.render('team')
})


module.exports = router