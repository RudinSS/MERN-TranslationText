// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ token, component: Component, ...rest }) => {
  return token ? <Component {...rest} /> : <Navigate to="/api/login" />;
};

export default ProtectedRoute;
