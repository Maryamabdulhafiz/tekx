const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const createToken = (id) => {
  return jwt.sign({ id }, "swertyhbcxdertyujnbvcds", { expiresIn: "90d" });
};

router.post("/signup", async function (req, res) {
  const { email, password, confirmPassword, nin } = req.body;

  if (!password)
    return res.status(400).json({
      status: "fail",
      message: "Password cannot be empty",
    });

  if (!confirmPassword)
    return res.status(400).json({
      status: "fail",
      message: "confirm password cannot be empty",
    });

  if (password.trim() !== confirmPassword.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Password is not the same",
    });
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  try {
    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Email cannot be emptyß",
      });
    }

    //check if email exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exist",
      });
    }

    //create user
    const newUser = await User.create({
      email: email,
      password: hash,
      confirmPassword: undefined,
      nin: nin,
    });

    const token = createToken(newUser._id);
    res.status(201).json({
      status: "success",
      token: token,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if there is email and password
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are require",
      });
    }

    //check if email exists
    const user = await User.findOne({ email }).select("password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "incorrect email or password",
      });
    }

    // check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({
        status: "fail",
        message: "incorrect email or password",
      });
    }

    //login user
    const token = createToken(user._id);
    res.status(201).json({
      status: "success",
      token: token,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "something went wrong",
    });
  }
});

module.exports = router;
