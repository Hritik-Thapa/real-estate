const { Router } = require("express");
const { tokenAuthenticate } = require("../middlewares/tokenAuth");
const {
  createListing,
  getUserListing,
} = require("../controllers/listing.controller");
const router = Router();

router.post("/create", tokenAuthenticate, createListing);
router.get("/getListing/:id", tokenAuthenticate, getUserListing);

module.exports = router;
