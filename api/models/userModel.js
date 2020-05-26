'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
    required: true
  },
  last_name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  mobile_number: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  vouchers:[{
    type:Schema.Types.ObjectId,
    ref:'Voucher'
  }],
  isVerified: { type: Boolean, default: false }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


mongoose.model('User', UserSchema);
