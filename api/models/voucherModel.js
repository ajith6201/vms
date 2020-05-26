'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var VoucherSchema = new Schema({
  voucher_name: {
    type: String,
    trim: true,
    required: true
  },
  voucher_pin: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
   amount: {
    type: Number,
    trim: true,
    required: true
  },
  count: {
    type: Number,
    trim: true,
    required: true
  },
  status: {
    type: String
  },
    redeems:[{
    type:Schema.Types.ObjectId,
    ref:'Redeem'
  }],
},{timestamps: true});

VoucherSchema.index({createdAt: 1},{expireAfterSeconds: 86400});


mongoose.model('Voucher', VoucherSchema);
