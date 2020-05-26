'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const tokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    experied:{ type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now, expires: 600000 }
});


mongoose.model('Token', tokenSchema);