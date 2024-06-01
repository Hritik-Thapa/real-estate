const Listing = require("../models/listing.model");
const errorHandler = require("../utils/error");

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
  try {
    const listings = await Listing.find({ createdBy: req.params.id });
    console.log(listings);
    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
}

async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    return res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

async function updateListing(req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing doesnt exist"));

  if (req.user._id !== String(listing.createdBy)) {
    return next(errorHandler(500, "You can only update your own listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updatedListing);
  } catch (err) {
    console.log("err");
    next(err);
  }
}

async function deleteListing(req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing doesnt exist"));

  if (req.user._id !== String(listing.createdBy)) {
    return next(errorHandler(500, "You can only delete your own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200);
  } catch (err) {
    console.log("err");
    next(err);
  }
}

module.exports = {
  createListing,
  getUserListing,
  getListing,
  updateListing,
  deleteListing,
};
