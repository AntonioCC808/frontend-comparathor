import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation(); // Get the current location
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} /> // Pass the current location
  );
}

export default ProtectedRoute;
