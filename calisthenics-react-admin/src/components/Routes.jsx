import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AuthWrapper from "./AuthWrapper.jsx";
import LogoutPage from "../pages/LogoutPage.jsx";
import Home from "../pages/Home.jsx";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

// Add your page imports here as you create them
// import UserListing from "../pages/admin-access/UserListing.jsx";
// etc.

function AppRoutes() {
  // Uncomment when you have Redux set up
  // const { t } = useTranslation();
  // const userRole = useSelector((state) => state.token.authState.userRole);
  // const userLoggedInStatus = useSelector(
  //   (state) => state.token.authState.loggedInAs
  // );

  // const indexPath =
  //   userRole === "SA" && userLoggedInStatus
  //     ? "/admin-access"
  //     : "/advisor-access";

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="home" element={<Home />} />
      <Route
        path="/"
        element={
          <AuthWrapper>
            <Layout />
          </AuthWrapper>
        }
      >
        {/* Add your routes here */}
        <Route index element={<Navigate replace to="/home" />} />

        {/* Example routes - add your actual routes as you create pages */}
        {/* 
        {userRole === "SA" && userLoggedInStatus && (
          <>
            <Route path="/admin-access" element={<UserListing />} />
            // Add more routes...
          </>
        )}
        */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
