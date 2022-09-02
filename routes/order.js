const express = require('express')
const router = express.Router()
const { forwardAuthenticated , ensureAuthenticated } = require('../config/auth');
const axios     =    require('axios')



router.get('/order', (req, res )=>{
  res.render('order')
})

router.get('/orderApproval',  async(req, res)=> {
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
  })
  if(!response){
    res.render('error-page')
  }else{
    console.log(response.data.data)
      res.render('confirmation-page')
  }
})

module.exports = router;