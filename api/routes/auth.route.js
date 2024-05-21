const { Router } = require("express");
const {
  signup,
  signin,
  googleAuth,
} = require("../controllers/auth.controller");
const { googleAuthenticator } = require("../middlewares/google.middleware");

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuthenticator, googleAuth);

module.exports = router;
