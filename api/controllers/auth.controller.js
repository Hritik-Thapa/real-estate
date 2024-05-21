const User = require("../models/user.model");
const { createHmac } = require("crypto");
const mongoose = require("mongoose");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    await User.create({ userName, email, password });
    return res.status(201).json("User created");
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const response = await User.matchPasswordForToken(email, password);
    return res
      .cookie("user_token", response.token, { httpOnly: true })
      .status(200)
      .json(response.userInfo);
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  console.log(`google auth controller`);
  const { email, userName, photo } = req.body;
  try {
    const response = await User.authenticateWithGoogle(email);
    return res
      .status(200)
      .cookie("user_token", response.token, { httpOnly: true })
      .json(response.userInfo);
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, googleAuth };
