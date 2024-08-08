const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  estado: String,
  cargo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;