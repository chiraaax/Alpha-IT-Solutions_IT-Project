import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) return <Navigate to="/Login" replace />;
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
