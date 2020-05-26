'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var RedeemSchema = new Schema({
  redeem_amount: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String
  }
},{timestamps: true});

RedeemSchema.index({createdAt: 1},{expireAfterSeconds: 86400});


mongoose.model('Redeem', RedeemSchema);
