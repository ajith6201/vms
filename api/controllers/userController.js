'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  path = require('path'),
  async = require('async'),
  crypto = require('crypto'),
  _ = require('lodash'),
  hbs = require('nodemailer-express-handlebars'),
  email = process.env.MAILER_EMAIL_ID || 'yourmailid@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'password',
  nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});


// var handlebarsOptions = {
//   viewEngine: 'handlebars',
//   partialsDir: './api/templates/',
//   viewPath: path.resolve('./api/templates/'),
//   extName: '.html'
// };

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


exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.password = undefined;
      // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the verification token
        token.save(function (err,token) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
              var data = {
                to: user.email,
                from: email,
                template: 'forgot-password-email',
                subject: 'Verification Mail!',
                context: {
                  url: 'http://localhost:3000/auth/confirmation?token=' + token.token,                  
                }
              };

              smtpTransport.sendMail(data, function(err) {
                if (!err) {
                  return res.json({ message: 'Kindly check your email for further instructions' });
                } else {
                  return done(err);
                }
              });
        });
      return res.json(user);
    }
  });
};



exports.render_forgot_password_template = function(req, res) {
  return res.sendFile(path.resolve('./public/forgot-password.html'));
};

exports.render_reset_password_template = function(req, res) {
  return res.sendFile(path.resolve('./public/reset-password.html'));
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'MarMeto') });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};



exports.confirmationPost = function (req, res, next) {

  console.log(req.query.token);

 
    // Find a matching token
    Token.findOne({ token: req.query.token }, function (err, token) {
        
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                
                res.status(200).send({msg:"The account has been verified. Please log in.",url: 'http://localhost:3000/auth/sign_in'});
            });
        });
    });
};
