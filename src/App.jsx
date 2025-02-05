import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import routes from "./routes/routes"; // Import your routes array
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");

  const handleAuthChange = (authState, userId = "") => {
    if (authState) {
      setUserId(userId);
      localStorage.setItem("user_id", userId);
    } else {
      setUserId("");
      localStorage.removeItem("user_id");
    }
  };

  return (
    <Router>
      <AppContent userId={userId} handleAuthChange={handleAuthChange} />
    </Router>
  );
}

function AppContent({ userId, handleAuthChange }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Header username={userId} onLogout={() => handleAuthChange(false)} />}

      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={handleAuthChange} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={Boolean(userId)}>
              <Home />
            </ProtectedRoute>
          }
        />
        {routes
          .filter(({ path }) => path !== "/home") // Skip '/home' since it's already handled
          .map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute isAuthenticated={Boolean(userId)}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}
      </Routes>
    </>
  );
}

export default App;
