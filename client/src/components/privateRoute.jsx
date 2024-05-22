import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  // return <div>PrivateRoute</div>;
  return <>{currentUser ? <Outlet /> : <Navigate to="/sign-in" />}</>;
};
