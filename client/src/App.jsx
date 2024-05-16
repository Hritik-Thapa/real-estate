import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Profile } from "./pages/Profile.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-out" element={<SignUp />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
