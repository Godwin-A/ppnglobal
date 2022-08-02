const express = require('express')
const router = express.Router()
const { forwardAuthenticated , ensureAuthenticated } = require('../config/auth');
const axios     =    require('axios')

router.get('/pay',ensureAuthenticated, (req, res)=>{
  res.render('payment', {user : req.user})
})


router.get('/pay/approved',ensureAuthenticated, async(req, res)=>{
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
  }).then(results =>{
    res.render('confirmation-page')
    const { status, currency, id, amount, customer } = results.data.data;
    console.log(customer)
  }).catch(
    res.render('error-page')
  )

})

module.exports = router;