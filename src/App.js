// src/App.js

import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
       />

      </Routes>
    </Router>
  );
}

export default App;
