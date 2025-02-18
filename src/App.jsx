import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const navigate = useNavigate(); // Hook to handle redirection

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
  }, []);

  // Redirect user to /home after login
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleAuthChange = (authState, userData = null, token = null) => {
    if (authState) {
      if (!token) {
        console.error("No token provided during login.");
        return;
      }
      localStorage.setItem("access_token", token); // ✅ Store token
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store user
      setUser(userData);
      navigate("/home", { replace: true }); // ✅ Redirect after login
    } else {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      logout();
      navigate("/login", { replace: true }); // ✅ Redirect after logout
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

  // Redirect user to /home if already logged in and trying to access /login
  useEffect(() => {
    if (user && location.pathname === "/login") {
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

        {/* Dynamically handle other routes */}
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
