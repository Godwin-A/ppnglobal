const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')


router.post('/',(req, res)=>{
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


module.exports = router
