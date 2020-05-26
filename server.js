'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'),
  Token = require('./api/models/tokenModel'),
  Voucher = require('./api/models/voucherModel'),
  Redeem = require('./api/models/redeemModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

  var authRoutes = require('./api/routes/authRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/marmeto', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//   if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
//     jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'MarMeto', function(err, decode) {
//       if (err) req.user = undefined;
//       req.user = decode;
//       next();
//     });
//   } else {
//     req.user = undefined;
//     next();
//   }
// });


// public route
app.use('/', authRoutes);




// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function(req, res, next) {
	let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
	console.log(err);
	
  if(err.status === 404)
  	res.status(404).json({message: "Not found"});
  else	
    res.status(500).json({message: "Something looks wrong :( !!!"});

});

// var routes = require('./api/routes/authRoutes');
// routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log('server started on: ' + port);

module.exports = app;