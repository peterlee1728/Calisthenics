import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthWrapper = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.token.authState.loggedInAs
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
