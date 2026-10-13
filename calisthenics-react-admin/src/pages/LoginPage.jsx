import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LoginPage.scss";
import { LoginDialog } from "./LoginDialog";

const LoginPage = () => {
  const isAuthenticated = useSelector(
    (state) => state.token.authState.loggedInAs
  );

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container-left">
      </div>
      <div className="login-container-right">
        <LoginDialog />
      </div>
    </div>
  );
};

export default LoginPage;
