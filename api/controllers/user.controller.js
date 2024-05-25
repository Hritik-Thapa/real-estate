const User = require("../models/user.model");
const errorHandler = require("../utils/error");

async function updateUser(req, res, next) {
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  // console.log(req.user);
  const { userName, email, password } = req.body;
  // console.log(password);
  const user = req.user;
  try {
    if (password) {
      console.log("password");
      const userFromDb = await User.findById(user._id);
      userFromDb.password = password;
      userFromDb.save();
    }
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { userName, email } },
      { new: true }
    );
    // console.log({ ...updatedUser._doc, password: undefined, salt: undefined });
    return res
      .status(201)
      .json({ ...updatedUser._doc, password: undefined, salt: undefined });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  if (req.user._id !== req.params.id)
    return next(errorHandler(401, "Cannot delete other accounts"));
  const id = req.params.id;
  try {
    User.findByIdAndDelete(id);
    return res.status(200).send("Deletion Complete");
  } catch (err) {
    next(err);
  }
}

async function logoutUser(req, res, next) {
  try {
    res.clearCookie("user_token");
    return res.status(200).send("Logout Complete");
  } catch (err) {
    next(err);
  }
}

module.exports = { updateUser, deleteUser, logoutUser };
