const { Router } = require("express");
const {
  updateUser,
  deleteUser,
  logoutUser,
} = require("../controllers/user.controller");
const { tokenAuthenticate } = require("../middlewares/tokenAuth");

const router = Router();

router.put("/:id", tokenAuthenticate, updateUser);
router.delete("/:id", tokenAuthenticate, deleteUser);
router.get("/logout/:id", tokenAuthenticate, logoutUser);

module.exports = router;
