import React from "react";
import "./LoginPage.scss";
import { LoginDialog } from "./LoginDialog";

const LoginPage = () => {
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
