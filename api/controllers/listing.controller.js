const Listing = require("../models/listing.model");
const errorHandler = require("../utils/error");

async function createListing(req, res, next) {
  const data = { ...req.body, createdBy: req.user._id };
  try {
    const listing = await Listing.create(data);
    res.status(201).json(listing);
    console.log(listing);
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
    const listing = await Listing.findById(req.params.id).populate("createdBy");
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

async function getListings(req, res, next) {
  console.log("find");
  try {
    const searchTerm = req.query.searchTerm || "";
    const startIndex = req.query.startIndex || 0;
    const limit = parseInt(req.query.limit) || 9;
    const priceHigh = parseInt(req.query.priceHigh) || Infinity;
    const priceLow = parseInt(req.query.priceLow) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false")
      offer = { $in: [false, true] };

    let rent = req.query.rent;
    if (rent === undefined || rent === "false") {
      console.log("rent falsey");
      rent = { $in: [false, true] };
    }
    let sale = req.query.sale;
    if (sale === undefined || sale === "false") sale = { $in: [false, true] };

    let parking = req.query.parking;
    if (parking === undefined || parking === "false")
      parking = { $in: [false, true] };

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false")
      furnished = { $in: [false, true] };

    const beds = parseInt(req.query.beds) || 1;
    const baths = parseInt(req.query.baths) || 1;
    const sort = req.query.sort || "createdAt";
    const sortOrder = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      regularPrice: { $gte: priceLow, $lte: priceHigh },
      sale,
      rent,
      parking,
      furnished,
      offer,
      bedrooms: { $gte: beds },
      bathrooms: { $gte: baths },
    })
      .sort({ [sort]: sortOrder })
      .limit(limit)
      .skip(startIndex);
    // console.log(listings);
    console.log(rent);

    res.status(200).json(listings);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = {
  createListing,
  getUserListing,
  getListing,
  updateListing,
  deleteListing,
  getListings,
};
