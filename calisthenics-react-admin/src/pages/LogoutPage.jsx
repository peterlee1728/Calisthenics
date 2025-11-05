import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice"; // Adjust path as needed

const LogoutPage = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Add logout logic when Redux is set up
    // dispatch(logout());

    // Redirect to login after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
