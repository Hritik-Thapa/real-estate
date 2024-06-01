const { Router } = require("express");
const { tokenAuthenticate } = require("../middlewares/tokenAuth");
const {
  createListing,
  getUserListing,
  getListing,
  updateListing,
  deleteListing,
  getListings,
} = require("../controllers/listing.controller");
const router = Router();

router.post("/create", tokenAuthenticate, createListing);
router.get("/getUserListing/:id", tokenAuthenticate, getUserListing);
router.get("/getListing/:id", getListing);
router.put("/update/:id", tokenAuthenticate, updateListing);
router.delete("/:id", tokenAuthenticate, deleteListing);
router.get("/get", getListings);
module.exports = router;
