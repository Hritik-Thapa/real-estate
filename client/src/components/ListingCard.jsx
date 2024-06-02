import React from "react";
import { FaLandmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export const ListingCard = ({ listingData }) => {
  return (
    <Link to={`/listing/${listingData._id}`}>
      <div className="bg-white flex gap-4 flex-col shadow hover:shadow-lg overflow-hidden transition-shadow duration-300 rounded-lg w-full sm:w-[330px]">
        <img
          src={listingData.imageUrls[0]}
          alt="listing"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="flex flex-col gap-2 p-3">
          <p className="text-lg font-semibold truncate">{listingData.name}</p>
          <p className="text-sm font-semibold truncate flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            {listingData.address}
          </p>
          <p className="truncate">{listingData.description}</p>
          <p>
            ${listingData.regularPrice}
            {listingData.rent ? `/month` : ""}
          </p>
          <p>
            {listingData.bedrooms} Beds {listingData.bathrooms} Baths
          </p>
        </div>
      </div>
    </Link>
  );
};
