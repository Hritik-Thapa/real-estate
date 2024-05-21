import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

export const SignIn = () => {
  const [formdata, setFormdata] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleFormChange(e) {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInStart());

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
    });

    try {
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFail(data.error));
        console.log(data.message);
        return;
      }
      dispatch(signInSuccess(JSON.stringify(data)));
      // console.log(`Api:${JSON.stringify(data)}`);
      navigate("/");
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-center text-3xl my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded-lg "
          placeholder="Email"
          type="email"
          onChange={handleFormChange}
          id="email"
          required
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Password"
          type="password"
          onChange={handleFormChange}
          id="password"
          required
        />
        <button className="bg-slate-700 text-white rounded-lg p-2 hover:opacity-90 disabled:opacity-50">
          {!loading ? "Sign In" : "Loading.."}
        </button>
      </form>
      <p className="text-center p-2">
        Dont have an account?
        <Link to="/sign-up" className="text-blue">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </p>
      {error ? <p className="text-center text-red-500">{error}</p> : null}
    </div>
  );
};
