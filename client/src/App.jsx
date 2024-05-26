import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Profile } from "./pages/Profile.jsx";
import Header from "./components/Header.jsx";
import { PrivateRoute } from "./components/privateRoute.jsx";
import { CreateListing } from "./pages/CreateListing.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
