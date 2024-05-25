const { Router } = require("express");
const { updateUser } = require("../controllers/user.controller");
const { tokenAuthenticate } = require("../middlewares/tokenAuth");

const router = Router();

router.put("/:id", tokenAuthenticate, updateUser);

module.exports = router;
