var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  // socials: [{type: Schema.Types.ObjectId, ref: 'Social'}],
  role: String,
  vk: Schema.Types.Mixed,
  access_token: String,
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', schema);

module.exports = User;
