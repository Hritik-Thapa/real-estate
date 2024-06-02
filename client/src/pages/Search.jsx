import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ListingCard } from "../components/ListingCard";

export const Search = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    searchTerm: "",
    rent: false,
    sale: false,
    priceHigh: "",
    priceLow: "",
    parking: false,
    furnished: false,
    beds: 1,
    baths: 1,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("useEffeect");
    const urlParams = new URLSearchParams(location.search);
    const searchTermfromUrl = urlParams.get("searchTerm");
    const rentfromUrl = urlParams.get("rent");
    const salefromUrl = urlParams.get("sale");
    const priceHighfromUrl = urlParams.get("priceHigh");
    const priceLowfromUrl = urlParams.get("priceLow");
    const furnishedfromUrl = urlParams.get("furnished");
    const parkingfromUrl = urlParams.get("parking");
    const orderfromUrl = urlParams.get("order");
    const sortfromUrl = urlParams.get("sort");
    const bedsfromUrl = urlParams.get("beds");
    const bathsfromUrl = urlParams.get("baths");
    const offerfromUrl = urlParams.get("offer");

    if (
      searchTermfromUrl ||
      rentfromUrl ||
      salefromUrl ||
      priceHighfromUrl ||
      priceLowfromUrl ||
      furnishedfromUrl ||
      parkingfromUrl ||
      orderfromUrl ||
      sortfromUrl ||
      bedsfromUrl ||
      bathsfromUrl ||
      offerfromUrl
    ) {
      setSearchData({
        ...searchData,
        searchTerm: searchTermfromUrl,
        rent: rentfromUrl === "true" ? true : false,
        sale: salefromUrl === "true" ? true : false,
        priceHigh: priceHighfromUrl || "",
        priceLow: priceLowfromUrl || "",
        parking: parkingfromUrl === "true" ? true : false,
        order: orderfromUrl || "desc",
        sort: sortfromUrl || "createdAt",
        furnished: furnishedfromUrl === "true" ? true : false,
        beds: bedsfromUrl || 1,
        baths: bathsfromUrl || 1,
        offer: offerfromUrl === "true" ? true : false,
      });
    }

    fetchListing(urlParams.toString());
  }, [window.location.search]);

  async function fetchListing(searchQuery) {
    console.log("fecthing");
    setLoading(true);

    const res = await fetch(`/api/listing/get?${searchQuery}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.success === false) {
      setError(data.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setListings(data);
    console.log(listings);
  }

  function handleSearchChange(e) {
    if (e.target.type === "checkbox") {
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.type === "text" || e.target.type === "number") {
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "order") {
      const sort = e.target.value.split("_");
      setSearchData({ ...searchData, sort: sort[0], order: sort[1] });
    }
    console.log(searchData);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("rent", searchData.rent);
    urlParams.set("sale", searchData.sale);
    if (searchData.priceHigh) urlParams.set("priceHigh", searchData.priceHigh);
    if (searchData.priceLow) urlParams.set("priceLow", searchData.priceLow);
    urlParams.set("parking", searchData.parking);
    urlParams.set("furnished", searchData.furnished);
    urlParams.set("beds", searchData.beds);
    urlParams.set("baths", searchData.baths);
    urlParams.set("offer", searchData.offer);
    urlParams.set("sort", searchData.sort);
    urlParams.set("order", searchData.order);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  }

  return (
    <div className="flex md:flex-row flex-col ">
      <div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 md:max-w-[500px]"
        >
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              onChange={handleSearchChange}
              value={searchData.searchTerm}
              type="text"
              id="searchTerm"
              placeholder="Search"
              className="p-3 border w-full rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2 p-3">
            <label className="font-semibold">Type:</label>
            <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={searchData.rent}
                onChange={handleSearchChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
              <input
                type="checkbox"
                id="sale"
                checked={searchData.sale}
                onChange={handleSearchChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
              <input
                type="checkbox"
                id="offer"
                checked={searchData.offer}
                onChange={handleSearchChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 ">
            <label className="font-semibold">Amenities:</label>
            <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={searchData.parking}
                onChange={handleSearchChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
              <input
                type="checkbox"
                id="furnished"
                checked={searchData.furnished}
                onChange={handleSearchChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 justify-between">
            <label className="font-semibold">Price Range:</label>
            <input
              type="number"
              placeholder="Min."
              id="priceLow"
              className="p-3 rounded-lg"
              onChange={handleSearchChange}
              value={searchData.priceLow}
              step={50}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max."
              id="priceHigh"
              className="p-3 rounded-lg"
              step={50}
              onChange={handleSearchChange}
              value={searchData.priceHigh}
            />
          </div>
          <div className="flex gap-3 p-3">
            <label className="font-semibold p-3">Features:</label>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                <span>Beds:</span>
                <input
                  type="number"
                  placeholder="Beds"
                  id="beds"
                  className="p-3 rounded-lg "
                  onChange={handleSearchChange}
                  value={searchData.beds}
                />
              </div>
              <div className="flex items-center">
                <span>Baths:</span>
                <input
                  type="number"
                  placeholder="Baths"
                  id="baths"
                  className="p-3 rounded-lg "
                  onChange={handleSearchChange}
                  value={searchData.baths}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3">
            <label className="font-semibold">Order:</label>
            <select
              className="p-3 rounded-lg"
              id="order"
              onChange={handleSearchChange}
            >
              <option value="createdAt_desc">Newest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="regularPrice_desc">Price Low to High</option>
              <option value="discountPrice_asc">Price High to Low</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-80 uppercase">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl text-slate-700 font-semibold m-7">
          Listing results:
        </h1>
        <div className=" flex  flex-col gap-5  flex-wrap sm:flex-row p-7">
          {error && <p className="text-center w-full"> {error}</p>}
          {loading && <p className="text-center w-full">Loading....</p>}
          {listings.length === 0 ? <p>No Listing Found</p> : ""}
          {!error &&
            !loading &&
            listings.map((listing) => {
              // console.log(listing);
              return <ListingCard listingData={listing} key={listing._id} />;
            })}
        </div>
      </div>
    </div>
  );
};
