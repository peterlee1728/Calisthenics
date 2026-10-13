import React from "react";
import "./Home.scss";
import SideMenuV2 from "../layouts/SideMenuV2";

const Home = () => {
  return (
    <div className="home flex h-screen">
      <div className="home-left-container border-2 border-red-500 ">
        <SideMenuV2 />
      </div>
      <div className="home-right-container border-2 border-blue-500">
        <h1>Home</h1>
        <p>Welcome to the home page of the Calisthenics Admin</p>
      </div>
    </div>
  );
};

export default Home;
