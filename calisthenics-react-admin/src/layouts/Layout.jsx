import Header from "../components/Header";
import InactivityComponent from "../components/InactivityComponent";
import SideMenu from "./SideMenu";
import { Globe } from "@/components/ui";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-column h-screen relative">
      <Globe className="fixed top-0 left-0 -z-10" />
      <Header />
      <div className="flex flex-1">
        <div className=" flex w-20rem ml-6">
          <InactivityComponent />
          <SideMenu />
        </div>
        <div className="flex m-0 w-full align-items-start	justify-content-start	px-6 pt-5 pb-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
