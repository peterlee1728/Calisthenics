import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LoginPage.scss";
import { LoginCard } from "./LoginCard";

export default function LoginPage(){
  const isAuthenticated = useSelector(
    (state) => state.token.authState.loggedInAs
  );

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="login-page relative">
      <div className="login-container-left"></div>
      <div className="login-container-right">
        <LoginCard />
      </div>
      <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
        v{__APP_VERSION__}
      </span>
    </div>
  );
};

