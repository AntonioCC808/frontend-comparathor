import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import routes from "./routes/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { getCurrentUser, logout } from "./api/auth";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.warn("🔴 No access token found. Logging out...");
          logout();
          setUser(null);
        } else {
          const currentUser = await getCurrentUser();

          if (currentUser && JSON.stringify(currentUser) !== JSON.stringify(user)) {
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
  }, [user]); // Run when the component mounts and when the user state changes

  const handleAuthChange = (authState, userData = null) => {
    if (authState) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
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
      {!isAuthPage && user && <Header username={user.user_id} setUser={handleAuthChange} />}
      <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<Login handleAuthChange={handleAuthChange} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={Boolean(user)}>
              <Home />
            </ProtectedRoute>
          }
        />
        {routes
          .filter(({ path }) => path !== "/home")
          .map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute isAuthenticated={Boolean(user)}>
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