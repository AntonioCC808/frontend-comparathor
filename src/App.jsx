import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Import Header
import routes from "./routes/routes"; // Import routes configuration

function App() {
  return (
    <Router>
      <Header username="CuadradoT" />
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
