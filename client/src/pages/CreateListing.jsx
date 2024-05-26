import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regularPrice: 0,
    discountPrice: 0,
    address: "",
    rent: true,
    sale: false,
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });
  const [imageUpload, setImageUpload] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [files, setFiles] = useState([]);

  function handleFormChange(e) {
    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    )
      setFormData({ ...formData, [e.target.id]: e.target.value });

    if (e.target.type === "checkbox")
      setFormData({ ...formData, [e.target.id]: e.target.checked });

    console.log(formData);
  }
  function handleImageUpload() {
    console.log(formData);
    setImageUpload(true);
    if (files.length < 0 || formData.imageUrls.length + files.length > 7) {
      console.log("upload");
      setImageUploadError("Maximum 6 images");
      return;
    }

    let promises = [];
    for (let i = 0; i < files.length; i++) {
      console.log("image promise");
      promises.push(storeImage(files[i]));
    }
    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUpload(false);
        setImageUploadError(false);
      })
      .catch((error) => {
        setImageUploadError("Cannot upload image larger than 2mb");
        setImageUpload(false);
      });
  }

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  function deleteListingImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      setImageUploadError("Please upload at least one image");
      return;
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Regular price must be higher than discount price");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/listing/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setError("Failed to create listing");
      return;
    }
    navigate(`/listing/${data._id}`);

    console.log(data);
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={5}
            required
            onChange={handleFormChange}
            value={formData.name}
          />
          <input
            type="textarea"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleFormChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleFormChange}
            value={formData.address}
          />
          <div className=" flex gap-6 flex-wrap">
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.sale}
              />
              <span>Sell</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.rent}
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleFormChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                id="bedrooms"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleFormChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                id="bathrooms"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleFormChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                id="regularPrice"
                step={50}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleFormChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Resgular Price</span>
                <span className="tes-xs">$/months</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                id="discountPrice"
                step={50}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleFormChange}
                value={formData.discountPrice}
              />
              <div className=" flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="tes-xs">$/months</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold p-3">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              First image is the cover. (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border-gray-300rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-3 text-green-700 border-green-700 border rounded hover:shadow-lg disabled:opacity-80"
            >
              {imageUpload ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div
                  className="flex justify-between p-3 border items-center"
                  key={url}
                >
                  <img
                    src={url}
                    alt="Listing Image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    className="rounded-lg p-3 text-red-700 font-semibold uppercase hover:opacity-80"
                    onClick={() => deleteListingImage(index)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          {imageUploadError ? (
            <span className="text-red-700 mt-3 text-center">
              {imageUploadError}
            </span>
          ) : (
            ""
          )}
          <button
            disabled={imageUpload || loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-60"
          >
            Create Listing
          </button>
          {error ? (
            <span className="text-red-700 mt-3 text-center">{error}</span>
          ) : (
            ""
          )}
        </div>
      </form>
    </main>
  );
};
