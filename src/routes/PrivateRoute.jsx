// src/routes/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/authService";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  if (checking) return null; // or a loading spinner

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
