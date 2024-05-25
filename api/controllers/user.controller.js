const User = require("../models/user.model");

async function updateUser(req, res, next) {
  console.log(req.user);
  const { userName, email, password } = req.body;
  console.log(password);
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

module.exports = { updateUser };
