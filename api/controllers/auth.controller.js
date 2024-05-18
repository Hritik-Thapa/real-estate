const User = require("../models/user.model");
const { createHmac } = require("crypto");
const mongoose = require("mongoose");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    await User.create({ userName, email, password });
    res.status(201).json("User created");
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validateUser = User.findOne({ email });
    const response = await User.matchPasswordForToken(email, password);
    res
      .cookie("user_token", response.token, { httpOnly: true })
      .status(200)
      .json(response.userInfo);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin };
