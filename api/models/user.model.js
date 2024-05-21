const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPassword;
  user.salt = salt;
  next();
});

userSchema.static("matchPasswordForToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Incorect Email");

  const salt = user.salt;
  const hashedPassword = user.password;

  const providedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (!(hashedPassword === providedPassword)) {
    throw new Error("Incorect Password");
  }
  const token = jwt.sign(
    { ...user._doc, password: undefined, salt: undefined },
    process.env.JSONSECRET
  );
  return {
    token,
    userInfo: { ...user._doc, password: undefined, salt: undefined },
  };
});

userSchema.static("authenticateWithGoogle", async function (email) {
  console.log("google auth static");
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("IDFK user not created");
  }
  console.log("User Found");
  const token = jwt.sign(
    { ...user._doc, password: undefined, salt: undefined },
    process.env.JSONSECRET
  );
  return {
    token,
    userInfo: { ...user._doc, password: undefined, salt: undefined },
  };
});

const User = model("user", userSchema);

module.exports = User;
