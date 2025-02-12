import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  const handleAuthChange = (authState, userData = null) => {
    if (authState) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
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
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && user && <Header username={user.user_id} onLogout={() => handleAuthChange(false)} />}
      <Routes>
        <Route path="/" element={<Login handleAuthChange={handleAuthChange} />} />
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