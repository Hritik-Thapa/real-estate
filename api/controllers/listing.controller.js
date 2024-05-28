const Listing = require("../models/listing.model");

async function createListing(req, res, next) {
  const data = { ...req.body, createdBy: req.user._id };
  try {
    const listing = Listing.create(data);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

async function getUserListing(req, res, next) {
  console.log("listing controller");
  try {
    const listings = await Listing.find({ createdBy: req.params.id });
    console.log(listings);
    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
}

module.exports = { createListing, getUserListing };
