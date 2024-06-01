const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

async function tokenAuthenticate(req, res, next) {
  const token = req.cookies.user_token;
  if (!token) {
    return next(errorHandler(404, "Unauthorized"));
  }

  jwt.verify(token, process.env.JSONSECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    req.user = user;
    next();
  });
}

module.exports = { tokenAuthenticate };
