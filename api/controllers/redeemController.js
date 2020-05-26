'use strict';

var mongoose = require('mongoose'),  
  Redeem = mongoose.model('Redeem');
 var Voucher = mongoose.model('Voucher');
 var User = mongoose.model('User');
var moment = require('moment');


   exports.redeemedVoucher = function(req,res)
  {
      if(!req.body.email)
      {
          return res.status(500).send({ msg : "Email Required!" });
      }

      User.findOne({'email':req.body.email}).lean(1).limit(1).exec(function(err, user){
            if(err)
            { 
                return res.status(500).send({ msg: err.message });
            }
            else
            {
                Voucher.findOne({'voucher_name': req.body.voucher,'voucher_pin':req.body.voucher_pin}).lean(1).limit(1).exec(function(err, voucher){
                    if(err)
                    { 
                        return res.status(500).send({ msg: err.message });
                    }

                    var nextDate = new Date(new Date() - 24*60*60*1000);
                   

                   if(voucher.createdAt > nextDate) 
                   { 
                       /* amount condition */
                       if(voucher.amount >= req.body.amount)
                       {
                           
                          
                           var balance = voucher.amount - req.body.amount;
                          
                          if(voucher.count < 5)
                          {
                            var count = voucher.count + 1;
                              Voucher.findOneAndUpdate({ _id: voucher._id }, {"amount":balance,"count":count}, { new: true },(err,doc)=>
                              {
                                  if(err)
                                  {
                                       return res.status(400).send({ msg:err });
                                  }
                                  Redeem.create({"redeem_amount":req.body.amount ,"status":"active"},(err,redeem_data)=> 
                                  {
                                      if(redeem_data)
                                      {
                                          
                                              Voucher.findOneAndUpdate({ _id: doc._id }, {$push:{ redeems: redeem_data._id }}, { new: true },(err,doc)=>
                                              {
                                                  console.log("updated redeem");
                                              });
                                          
                                      }
                                      
                                  });
                                  return res.status(200).send({ data:doc });
                              });
                          }
                          else
                          {
                              return res.status(500).send({ msg: "Limit Exceeded!" });
                          }
                       }
                       else
                       {
                           return res.status(500).send({ msg: "Amount Exceeded!" });
                       }
                       /* amount ends here */
                   }
                   else
                   {
                       return res.status(500).send({ msg: "Vocher Expired!" });
                   }

                    //var diffTime = currentTime.diff(timeStore,'h');

                });
            }
        });

  }


