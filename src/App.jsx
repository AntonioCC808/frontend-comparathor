import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import routes from "./routes/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import PublicProducts from "./components/PublicPage"; // ✅ Import the new public page
import { getCurrentUser, logout } from "./api/auth";
import PublicPage from "./components/PublicPage";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let token = localStorage.getItem("access_token");
  
        if (!token) {
          console.warn("No access token found. Logging out...");
          logout();
          setUser(null);
          return;
        }
  
        const currentUser = await getCurrentUser();
        if (currentUser) {
          if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
        setUser(null);
      }
    };
  
    fetchUser();
  }, []); // ✅ Remove dependency on `user` to avoid unnecessary calls
  

  const handleAuthChange = (authState, userData = null, token = null) => {
    if (authState) {
      if (!token) {
        console.error("No token provided during login.");
        return;
      }
      localStorage.setItem("access_token", token); // ✅ Store token
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store user
      setUser(userData);
    } else {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      logout();
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent user={user} handleAuthChange={handleAuthChange} />} />
      </Routes>
    </Router>
  );
}

function AppContent({ user, handleAuthChange }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && user && <Header user={user} setUser={handleAuthChange} />}
      <Routes>
        {/* Default route: PublicPage for guests, Home for logged-in users */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <PublicPage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login handleAuthChange={handleAuthChange} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Explicitly define /home to ensure it's always accessible */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={Boolean(user)}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Dynamically handle all other routes */}
        {routes
          .filter(({ path }) => path !== "/home") // Avoid duplicate definition
          .map(({ path, component: Component, protected: isProtected, adminOnly }) => (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute isAuthenticated={Boolean(user)} user={user} adminOnly={adminOnly}>
                    <Component />
                  </ProtectedRoute>
                ) : (
                  <Component />
                )
              }
            />
          ))}
      </Routes>
    </>
  );
}

export default App;
