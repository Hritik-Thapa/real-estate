import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { ListingCard } from "../components/ListingCard";

export const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  SwiperCore.use(Navigation);

  useEffect(() => {
    fetchOfferListing();
  }, []);
  const fetchOfferListing = async () => {
    try {
      const res = await fetch(`/api/listing/get?offer=true&limit=4`, {
        method: "GET",
      });
      const data = await res.json();
      setOfferListing(data);
      fetchRentListing();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRentListing = async () => {
    try {
      const res = await fetch(`/api/listing/get?rent=true&limit=4`);
      const data = await res.json();
      setRentListing(data);
      fetchSaleListing();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSaleListing = async () => {
    try {
      const res = await fetch(`/api/listing/get?sale=true&limit=4`);
      const data = await res.json();
      setSaleListing(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* top */}

      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className=" text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />
          place with peace
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          <h1>Property Peak is the best place to find your next home</h1>
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm font-bold text-blue-800 hover:underline"
        >
          Get Started Here...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {rentListing &&
          rentListing.length > 0 &&
          rentListing.map((listing) => {
            return (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url('${listing.imageUrls[0]}') center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700 py-2">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-blue-700 text-sm hover:underline"
              >
                Show more offers
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {offerListing.map((listing) => {
                return <ListingCard listingData={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700 py-2">
                Recent Places For rent
              </h2>
              <Link
                to="/search?rent=true"
                className="text-blue-700 text-sm hover:underline"
              >
                Show more places for rent
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {rentListing.map((listing) => {
                return <ListingCard listingData={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700 py-2">
                Recent Places For Sale
              </h2>
              <Link
                to="/search?sale=true"
                className="text-blue-700 text-sm hover:underline"
              >
                Show more places for sale
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {saleListing.map((listing) => {
                return <ListingCard listingData={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
