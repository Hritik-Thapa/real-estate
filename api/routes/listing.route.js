const { Router } = require("express");
const { tokenAuthenticate } = require("../middlewares/tokenAuth");
const { createListing } = require("../controllers/listing.controller");
const router = Router();

router.post("/create", tokenAuthenticate, createListing);

module.exports = router;
