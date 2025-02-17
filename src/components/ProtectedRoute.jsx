import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, user, adminOnly, children }) {
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires admin access and the user is not an admin, redirect
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/home" replace />; // Redirect non-admin users
  }

  return children;
}

export default ProtectedRoute;
