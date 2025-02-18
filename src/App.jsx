import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import routes from "./routes/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import PublicPage from "./components/PublicPage"; 
import { getCurrentUser, logout } from "./api/auth";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  const firstRender = useRef(true); // Track first render

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
          const storedUser = localStorage.getItem("user");
          if (!storedUser || JSON.stringify(currentUser) !== storedUser) {
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
  }, []);

  // ✅ Only redirect **after login**, avoiding infinite loop
  useEffect(() => {
    console.log("User state changed:", user);
    if (firstRender.current) {
      firstRender.current = false;
      return; // Prevent first-load redirect
    }
    if (user && window.location.pathname === "/login") {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleAuthChange = (authState, userData = null, token = null) => {
    if (authState) {
      if (!token) {
        console.error("No token provided during login.");
        return;
      }
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/home", { replace: true });
    } else {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <Routes>
      <Route path="/*" element={<AppContent user={user} handleAuthChange={handleAuthChange} />} />
    </Routes>
  );
}

function AppContent({ user, handleAuthChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // ✅ Prevent redirect loop: Only redirect if **not already on /home**
  useEffect(() => {
    console.log("Navigating check:", { user, location: location.pathname });
    if (user && isAuthPage && location.pathname !== "/home") {
      navigate("/home", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <>
      {!isAuthPage && user && <Header user={user} setUser={handleAuthChange} />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <PublicPage />} />
        <Route path="/login" element={<Login handleAuthChange={handleAuthChange} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" replace />} />

        {routes
          .filter(({ path }) => path !== "/home")
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
