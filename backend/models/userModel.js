const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a mail"],
    unique: [true, "Email already exist"],
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    select: false,
  },
  nin: {
    type: Number,
    unique: [true, "NIN already exist"],
    minlength: 11,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
