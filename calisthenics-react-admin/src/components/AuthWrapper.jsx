import React from "react";
import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

const AuthWrapper = ({ children }) => {
  // TODO: Uncomment when you have Redux set up
  // const isAuthenticated = useSelector((state) => state.token.authState.loggedInAs);

  // For now, allow access - you can add authentication check later
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

export default AuthWrapper;
