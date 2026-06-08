const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    match: [/^(\+91|91)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    trim: true,
    required: true
  },
  email: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    trim: true,
    required: true,
    unique: true
  }
});

module.exports = model('User', userSchema);
