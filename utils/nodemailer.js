const nodemailer = require("nodemailer");

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: "465", 
    service:'gmail',
    auth: {
      user: 'ppnglobalventureslimited@gmail.com',
      pass: 'ckhlwsczcvorblcb', 
    },
    tls:{
      rejectUnauthorized:false
  }
  });

  // send mail with defined transport object
 options = {
    from: 'ppnglobalventureslimited@gmail.com', 
    to: "aikonedog@gmail.com",
    subject: "Hello lets see if this works",
    text: "lets see if it works again man . bcus i don tire for this nonsense", // plain text body
    // html: "<b>Hello world?</b>", // html body
  };

  transporter.sendMail(options, function(err, info){
    if(err){
      console.log(err)
      return
    }else{
   console.log(info.response)
    }
  })


  