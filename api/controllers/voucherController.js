'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  Voucher = mongoose.model('Voucher'),
    hbs = require('nodemailer-express-handlebars'),
    path = require('path'),
  email = process.env.MAILER_EMAIL_ID || 'ajithjbdvt@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'Silvermoon@123',
  nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});
 var User = mongoose.model('User');
  var voucher_codes = require('voucher-code-generator');

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./api/templates/'),
    layoutsDir: path.resolve('./api/templates/'),    
  },
  viewPath: path.resolve('./api/templates/'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));

  exports.generateVoucher = function(req,res) 
  {
    console.log(req.body);
    if (!req.body.email) 
    {
       return res.status(400).send({ msg: 'Email is Required.' });
    }
    else
    {

          User.findOne({
                email: req.body.email
            }, function(err, user) {
                if (err) throw err;
                if (!user) {
                return res.status(401).json({ message: 'Authentication failed. Invalid user.' });
                }
                
                var voucher = voucher_codes.generate({
                prefix: "VCD",
                postfix: "",
                length: 10
                    });

                var voucher_pin = voucher_codes.generate({
                length: 5
                    });
                    



                 Voucher.create({"voucher_name":voucher[0], "voucher_pin":voucher_pin[0],"status":"active","email":req.body.email,"amount":req.body.amount,"count":0},(err,voucher_data)=> {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                        if (user.vouchers.indexOf(voucher_data._id) === -1) {
                            User.findOneAndUpdate({ _id: user._id }, {$push:{ vouchers: voucher_data._id }}, { new: true },(err,doc)=>{
                                    if (err) {
                                            console.log("Something wrong when updating data!");
                                        }
                                    /* email */
                                    // Send the email
                                        var data = {
                                            to: user.email,
                                            from: email,
                                            template: 'reset-password-email',
                                            subject: 'Voucher Mail',
                                            context: {
                                            msg1: 'Voucher - '+voucher_data.voucher_name,
                                            msg2: 'Pin - '+voucher_data.voucher_pin               
                                            }
                                        };

                                        smtpTransport.sendMail(data, function(err) {
                                            if (!err) {
                                            return res.json({ message: 'Kindly check your email for further instructions' });
                                            } else {
                                            return done(err);
                                            }
                                        });
                                    /* email ends here */
                                    res.status(200).send({data:voucher_data});
                                });
                        } else {
                            res.status(400).send("Update error");
                        }


                        //return res.status(200).send({ data: data });
                    });
            });


        


    }


  }


  exports.manageVoucher = function(req,res)
  {
      Voucher.find().lean().sort({_id: 'asc'}).exec(function(err, vouchers){
            if(err)
            { 
                return res.status(500).send({ msg: err.message });
            }
            else
            {                
               return res.status(200).send({data:vouchers});
            }
        });
  }



exports.searchVoucher = function(req,res,next)
{
  
  var queryvalue = req.query.searchtext;

  var pageNo = parseInt(req.query.pageNo); 

  var size = parseInt(req.query.limit); 

    if (pageNo < 0 || pageNo === 0) {
      response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response)
  }
  skip = size * (pageNo - 1);
  limit = size;

  var re = new RegExp(queryvalue, 'i');

      

      Voucher.find().or([
        { 'voucher_name': { $regex: re }},
        { 'voucher_pin': { $regex: re }},
        { 'email': { $regex: re }},
        { 'createdAt': { $regex: re }}]).lean().skip(skip).limit(limit).sort({_id: 'asc'}).exec(function(err, vouchers) {
        if(err)
        { return res.status(400).send({msg:err});}
        else{
            return res.status(200).send({data:vouchers});
            }
      });
    
    





}