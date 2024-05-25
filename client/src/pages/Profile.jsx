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
} from "../redux/user/userSlice";

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
  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();
  // const [email, setEmail] = useState();

  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
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
          onClick={handleFormSubmit}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-60"
        >
          Update
        </button>
      </form>
      {error ? <p className="text-red-700 mt-3 text-center">{error}</p> : ""}
      {updateSuccess ? (
        <p className="text-green-700 text-center">Updated Successfully</p>
      ) : (
        ""
      )}
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};
