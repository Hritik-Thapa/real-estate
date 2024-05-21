import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OAuth } from "../components/OAuth";

export const SignUp = () => {
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleFormChange(e) {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
    console.log(formdata);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
    });

    try {
      const data = await res.json();
      if (data.success === false) {
        setError(data.error);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setError(error);
      console.log(data);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-center text-3xl my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded-lg "
          type="text"
          placeholder="Username"
          onChange={handleFormChange}
          id="userName"
          required
        />
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
          {!loading ? "SignUp" : "Loading.."}
        </button>
        <OAuth />
      </form>
      <p className="text-center p-2">
        Already have an account?
        <Link to="/sign-in" className="text-blue">
          <span className="text-blue-700">Login</span>
        </Link>
      </p>
      {error ? <p className="text-center text-red-500">{error}</p> : null}
    </div>
  );
};
