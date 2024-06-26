import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFail,
  updateUserSuccess,
  updateUserStart,
  logoutUserFail,
  logoutUserStart,
  logoutUserSuccess,
  errorReset,
} from "../redux/user/userSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [fileUpload, setFileUpload] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: currentUser.userName,
    email: currentUser.email,
    password: "",
  });
  const [listing, setListing] = useState([]);
  const [listingError, setListingError] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    return () => {
      dispatch(errorReset());
    };
  }, [file]);

  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUpload(Math.round(progress));
      },
      (error) => {
        setFileError(true);
        uploadTask.cancel();
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, pfpUrl: downloadURL })
        );
      }
    );
  }

  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData.password);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    dispatch(updateUserStart());
    const res = await fetch(`/api/user/${currentUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    try {
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log("Data success false");
        dispatch(updateUserFail(data.error));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
      return;
    } catch (err) {
      dispatch(updateUserFail(err.message));
      return;
    }
  }

  async function handleLogout() {
    dispatch(logoutUserStart());
    try {
      const res = await fetch(`/api/user/logout/${currentUser._id}`, {
        method: "GET",
      });
      if (res.status) {
        dispatch(logoutUserSuccess());
        Navigate("/");
        return;
      }
      dispatch(logoutUserFail(data.error));
    } catch (err) {
      dispatch(logoutUserFail(err));
      return;
    }
  }

  async function handleProfileDelete() {
    dispatch(logoutUserStart());
    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      console.log(res);
      if (res.status) {
        dispatch(logoutUserSuccess());
        Navigate("/");
        return;
      }
      dispatch(logoutUserFail(data.error));
    } catch (err) {
      dispatch(logoutUserFail(err));
      return;
    }
  }

  async function handleListings() {
    try {
      const res = await fetch(
        `/api/listing/getUserListing/${currentUser._id}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setListingError("Error fetching listings");
        return;
      }
      console.log(typeof data.length);
      if (data.length === 0) {
        setListingError("Create a listing to get started");
        console.log(listingError);
      }
      setListing(data);
    } catch (err) {
      setListingLoading(false);
      setListingError("Error fetching listings");
    }
  }

  function handleDeleteListing(id) {
    fetch(`/api/listing/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) handleListings;
      })
      .catch((err) => {
        setListingLoading(false);
        setListingError("Error Deleting Listing");
      });
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="images/*"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.pfpUrl || currentUser?.pfpUrl}
          alt="profile"
          className="rounded-full w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        {fileError ? (
          <span className="text-red-700 self-center">
            Error Uploading Image (must be lower than 2mb){" "}
          </span>
        ) : fileUpload > 0 && fileUpload < 100 ? (
          <span className="text-slate-700 self-center">{`Uploading ${fileUpload}%`}</span>
        ) : fileUpload === 100 ? (
          <span className="text-green-700 self-center"> Upload SuccesFull</span>
        ) : (
          ""
        )}
        <input
          id="userName"
          type="text"
          placeholder="Username"
          className="border rounded-lg h-12 p-3"
          onChange={handleFormChange}
          defaultValue={currentUser.userName}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border rounded-lg h-12 p-3"
          onChange={handleFormChange}
          defaultValue={currentUser.email}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border rounded-lg h-12 p-3"
          onChange={handleFormChange}
          defaultValue={currentUser.password}
        />
        <button
          disabled={loading}
          onClick={handleFormSubmit}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-60"
        >
          {loading ? <FaSpinner /> : "Update Profile"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-center uppercase p-3 rounded-lg text-white hover:opacity-80 cursor-pointer"
        >
          <span>Create Listing</span>
        </Link>
      </form>
      {error ? <p className="text-red-700 mt-3 text-center">{error}</p> : ""}
      {updateSuccess ? (
        <p className="text-green-700 text-center mt-3">Updated Successfully</p>
      ) : (
        ""
      )}
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleProfileDelete}
        >
          Delete
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleLogout}>
          Sign Out
        </span>
      </div>
      <p
        onClick={handleListings}
        className="text-center text-green-700 cursor-pointer"
      >
        View Listings
      </p>
      {listingError ? (
        <p className="text-red-700 text-center mt-3">{listingError}</p>
      ) : (
        ""
      )}
      {listing && listing.length > 0 && (
        <div className="flex flex-col gap-3">
          <h1 className="text-center text-3xl font-semibold my-7">
            Your Listings
          </h1>
          {listing.map((list) => {
            return (
              <div
                className="flex items-center space-around border p-3 rounded-lg"
                key={list._id}
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls[0]}
                    alt="listing image"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  to={`/listing/${list._id}`}
                  className="hover:underline font-semibold truncate p-2 flex-1"
                >
                  <p>{list.name}</p>
                </Link>
                <div className="felx flex-col gap-2">
                  <p
                    className="text-red-700 font-semibold uppercase cursor-pointer text-center"
                    onClick={() => handleDeleteListing(list._id)}
                  >
                    Delete
                  </p>
                  <Link to={`/update-listing/${list._id}`}>
                    <p className="text-green-700 font-semibold uppercase cursor-pointer text-center">
                      edit
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
