import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export const Listing = () => {
  const params = useParams();
  SwiperCore.use(Navigation);

  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [message, setMessage] = useState(null);

  console.log(listing);

  useEffect(() => {
    console.log("fetching");
    fetchListing();
  }, [params.listingId]);

  const fetchListing = async () => {
    setLoading(true);
    fetch(`/api/listing/getListing/${params.listingId}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setListing(data);
            console.log(listing);
            setLoading(false);
            setError(false);
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      });
  };

  return (
    <main>
      {error && <h1>Error Loading Listing</h1>}
      {loading && <h1>Loading...</h1>}
      {!error && !loading && (
        <>
          <Swiper navigation>
            {listing?.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px] "
                  style={{
                    background: `url('${image}') center no-repeat`,
                    backgroundSize: `cover`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[5%] z-10 flex justify-center items-center w-12 h-12 bg-slate-100 rounded-full boder cursor-pointer">
            <FaShare
              className="text-slate-500 "
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <span className="text-slate-800 bg-slate-300 z-10 p-2 rounded-lg text-center fixed top-[15%] right-[10%]">
              Copied to Clipboard
            </span>
          )}
          <div className="flex flex-col max-w-4xl my-7 gap-7 mx-auto ">
            <h1 className="font-semibold text-3xl text-left ">
              {listing?.name} -{" "}
              {listing?.offer
                ? listing?.discountPrice.toLocaleString("en-US")
                : listing?.regularPrice.toLocaleString("en-US")}
              {listing?.rent ? " / month" : ""}
            </h1>
            <p className="flex items-center gap-2 text-slate-700 font-semibold">
              <FaMapMarkerAlt className="text-green-700 " />
              {listing?.address}
            </p>
            <span className="w-[20%] bg-red-800 text-center p-2 rounded-lg text-white">
              For {listing?.rent ? "rent" : "sale"}
            </span>
            <p>
              <span className="font-semiblold">Description</span> -{" "}
              {listing?.description}
            </p>
            <div className="flex gap-4 text-green-700">
              <p className="flex gap-1 items-center">
                <FaBath />
                {listing?.bathrooms} Bathrooms
              </p>
              <p className="flex gap-1 items-center">
                <FaBed />
                {listing?.bedrooms} Bedrooms
              </p>
              <p className="flex gap-1 items-center">
                <FaParking />
                {listing?.bathrooms ? "Parking spot" : "No Parking"}
              </p>
              <p className="flex gap-1 items-center">
                <FaChair />
                {listing?.bathrooms ? "Furnished" : "Not Furnished"}
              </p>
            </div>
            {currentUser?._id !== String(listing?.createdBy._id) ? (
              contact ? (
                <>
                  <p>
                    Contact {listing?.createdBy?.userName} for {listing?.name}
                  </p>
                  <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    className="border rounded-lg p-3"
                    placeholder="Add your message"
                  ></textarea>
                  <Link
                    to={`mailto:${listing?.createdBy.email}?subject=Regarding ${listing?.name}&body=${message}`}
                    className="bg-slate-700 text-center p-3 text-white rounded-lg "
                  >
                    SEND MESSAGE
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="bg-slate-700 text-white font-semibold text-center p-5 rounded-lg"
                    onClick={() => setContact(true)}
                  >
                    CONTACT LANDLORD
                  </button>
                </>
              )
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </main>
  );
};
