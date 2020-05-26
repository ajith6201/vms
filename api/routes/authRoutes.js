'use strict';



const express = require('express');
const router = express.Router();
const userHandlers = require('../controllers/userController.js'),
voucherHandlers = require('../controllers/voucherController.js'),
redeemHandlers = require('../controllers/redeemController.js');
var jwt = require('jsonwebtoken');

  
  router.post('/auth/register',userHandlers.register);

  router.post('/auth/sign_in',userHandlers.sign_in);



  router.get('/auth/confirmation', userHandlers.confirmationPost);

  router.post('/voucher/generate', validateUser , voucherHandlers.generateVoucher);

  router.get('/voucher/managevouchers', validateUser, voucherHandlers.manageVoucher);

  router.post('/redeem/redeemvoucher', validateUser, redeemHandlers.redeemedVoucher);

  router.get('/searchvouchers', validateUser, voucherHandlers.searchVoucher);


function validateUser(req, res, next) { 
  jwt.verify(req.headers['x-access-token'], 'MarMeto', function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}

module.exports = router;
