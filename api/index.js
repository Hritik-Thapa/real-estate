require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");

const PORT = 5555;

console.log(process.env.MONGO);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use((err, req, res, next) => {
  const error = err.message;
  console.log(`index ${error}`);
  const statusCode = 500;
  const success = false;
  return res.status(statusCode).json({
    success,
    error,
    statusCode,
  });
});

app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
