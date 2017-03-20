// not used yet
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  sn: String,
  profile: Schema.types.Mixed,
  access_token: String,
  refresh_token: String,
  token_expires: Date,
  created_at: Date,
  updated_at: Date
});

var Social = mongoose.model('Social', schema);

module.exports = Social;
