const User = require("../models/user.model");

const googleAuthenticator = async (req, res, next) => {
  const { email, userName, photo } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("user not found");
      const password = Math.random().toString(36).slice(-8);
      const pfpUrl = photo;
      try {
        await User.create({ userName, email, password, pfpUrl }).then(
          (createdUser) => {
            console.log(createdUser);
            req.body.newField = createdUser;
          }
        );
      } catch (error) {
        console.log(error);
        next(error);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { googleAuthenticator };
