import React from "react";
import "./SideMenuV2.scss";
import { AnimatedThemeToggler } from "../components/ui";

export default function SideMenuV2() {
  return (
    <div>
      <div className="flex flex-col h-screen bg-sky-700 text-white">
        <div className="flex border-2 border-red-500 justify-center">
          Logo <AnimatedThemeToggler />
        </div>
        <div className="flex flex-col flex-1 justify-start items-start gap-3 m-3">
          Dashboard
          <div>Menu Item 1</div>
          <div>Menu Item 1A</div>
          <div>Menu Item 1B</div>
          <div>Menu Item 1C</div>
          <div>Menu Item 2</div>
          <div>Menu Item 2A</div>
          <div>Menu Item 2B</div>
          <div>Menu Item 2C</div>
          <div>Menu Item 3</div>
          <div>Menu Item 3A</div>
          <div>Menu Item 3B</div>
          <div>Menu Item 3C</div>
        </div>
        <div className="flex border-2 border-green-500 justify-center items-end my-3">
          Footer
        </div>
      </div>
    </div>
  );
}
