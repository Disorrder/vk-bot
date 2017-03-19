var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  sn: String, // social network or any kind of chat. One of ['vk'].
  access_token: String,
  created_at: Date,
  updated_at: Date
});

var Bot = mongoose.model('Bot', schema);

module.exports = Bot;
