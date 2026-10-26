import React from "react";
import "./Home.scss";
import SideMenuV2 from "../layouts/SideMenuV2";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="home flex h-screen">
      <div className="home-container flex flex-col h-screen">
        {/* Header — fixed height */}
        <div className="relative flex items-center justify-center shadow-md border-b h-15 shrink-0">
          <div className="absolute left-2">
            <SideMenuV2 />
          </div>
          <img
            src="/images/lever_lab_brand_name.png"
            alt="Brand Name"
            className="h-14 w-auto"
          />
        </div>
        {/* Content — fills remaining height, scrolls internally */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
