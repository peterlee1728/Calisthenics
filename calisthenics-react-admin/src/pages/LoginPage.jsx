import React from "react";
import "./LoginPage.scss";
import { LoginDialog } from "./LoginDialog";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <LoginDialog />
      </div>
    </div>
  );
};

export default LoginPage;
