import Header from "../components/Header";
import InactivityComponent from "../components/InactivityComponent";
import SideMenuV2 from "./SideMenuV2";
import { Globe } from "@/components/ui";
import { Sidebar } from "primereact/sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen relative">
      <Globe className="fixed top-0 left-0 -z-10" />
      <Header />
      <Sidebar.Layout>
        <Sidebar.Root id="admin-sidebar" collapsible="icon">
          <Sidebar.Spacer />
          <Sidebar.Aside>
            <InactivityComponent />
            <SideMenuV2 />
            <Sidebar.Rail />
          </Sidebar.Aside>
        </Sidebar.Root>
        <Sidebar.Main>
          <Sidebar.Trigger />
          <div className="flex m-0 w-full items-start justify-start px-6 pt-5 pb-2">
            <Outlet />
          </div>
        </Sidebar.Main>
      </Sidebar.Layout>
    </div>
  );
};

export default Layout;
