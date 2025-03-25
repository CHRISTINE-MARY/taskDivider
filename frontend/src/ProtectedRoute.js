import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Get JWT from storage
  console.log(token)
  return token ? <Outlet /> : <Navigate to="/" />; // Redirect if no token
};

export default ProtectedRoute;
