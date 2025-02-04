import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/routes"; // Import your routes array
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MainDashboard from "./components/MainDashboard";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleAuthChange = (authState) => {
    setIsAuthenticated(authState);
    localStorage.setItem("isAuthenticated", authState);
  };


  return (
    <Router>
       {isAuthenticated && <Header username="User" onLogout={() => handleAuthChange(false)} />}
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainDashboard />
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
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}
      </Routes>
    </Router>
  );
}

export default App;
